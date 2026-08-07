// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts v5.x
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TIMAH Token (TIMAH)
 * @author Timah Development Team & Security Audit Suite
 * @notice Standard ERC-20 token with initial supply of 1,000,000 TIMAH.
 * @dev Features:
 *  - Initial Supply: 1,000,000 TIMAH (18 Decimals)
 *  - OpenZeppelin Contracts v5.x integration
 *  - Restricted Minting with Whitelist Validation (onlyOwner + Whitelist control)
 *  - Controlled Token Burning (ERC20Burnable)
 *  - Emergency Pause Mechanism (ERC20Pausable)
 *  - Reentrancy Protection (ReentrancyGuard)
 *  - Real-time Audit & Activity Logging Events
 *  - End-to-End Compliance & Operational Tracking
 */
contract TimahToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {

    // Initial total supply: 1,000,000 TIMAH tokens with 18 decimals
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18;

    // Maximum minting cap to prevent unlimited inflation (e.g., 10,000,000 TIMAH)
    uint256 public constant MAX_SUPPLY_CAP = 10_000_000 * 10**18;

    // Whitelist tracking mapping
    mapping(address => bool) private _whitelisted;

    // Total whitelisted accounts counter
    uint256 public totalWhitelistedCount;

    // ==========================================
    // EVENTS FOR REAL-TIME AUDIT & MONITORING
    // ==========================================

    event TokensMinted(
        address indexed to,
        uint256 amount,
        address indexed caller,
        uint256 newTotalSupply,
        uint256 timestamp
    );

    event TokensBurned(
        address indexed burner,
        uint256 amount,
        uint256 newTotalSupply,
        uint256 timestamp
    );

    event WhitelistUpdated(
        address indexed account,
        bool isWhitelisted,
        address indexed updatedBy,
        uint256 timestamp
    );

    event BatchWhitelistUpdated(
        uint256 totalUpdated,
        bool isWhitelisted,
        address indexed updatedBy,
        uint256 timestamp
    );

    event EmergencyPauseTriggered(
        address indexed ownerAddress,
        string reason,
        uint256 timestamp
    );

    event EmergencyUnpauseTriggered(
        address indexed ownerAddress,
        uint256 timestamp
    );

    event SecurityAnomalyDetected(
        address indexed target,
        string anomalyType,
        uint256 value,
        uint256 timestamp
    );

    // ==========================================
    // MODIFIERS
    // ==========================================

    modifier onlyWhitelisted(address account) {
        require(_whitelisted[account], "TimahToken: Target account is not whitelisted");
        _;
    }

    /**
     * @notice Constructor sets token name, symbol, owner and initial minting of 1,000,000 TIMAH.
     * @param initialOwner Address of the contract owner (admin)
     */
    constructor(address initialOwner)
        ERC20("TIMAH", "TIMAH")
        Ownable(initialOwner)
    {
        require(initialOwner != address(0), "TimahToken: Initial owner cannot be zero address");

        // Automatically whitelist owner
        _whitelisted[initialOwner] = true;
        totalWhitelistedCount = 1;
        emit WhitelistUpdated(initialOwner, true, initialOwner, block.timestamp);

        // Mint initial supply of 1,000,000 TIMAH to initial owner
        _mint(initialOwner, INITIAL_SUPPLY);

        emit TokensMinted(initialOwner, INITIAL_SUPPLY, msg.sender, totalSupply(), block.timestamp);
    }

    // ==========================================
    // WHITELIST MANAGEMENT FUNCTIONS
    // ==========================================

    /**
     * @notice Adds an address to the verified whitelist.
     * @param account Address to be whitelisted
     */
    function addToWhitelist(address account) external onlyOwner nonReentrant {
        require(account != address(0), "TimahToken: Cannot whitelist zero address");
        require(!_whitelisted[account], "TimahToken: Account already whitelisted");

        _whitelisted[account] = true;
        totalWhitelistedCount += 1;

        emit WhitelistUpdated(account, true, msg.sender, block.timestamp);
    }

    /**
     * @notice Removes an address from the whitelist.
     * @param account Address to be removed
     */
    function removeFromWhitelist(address account) external onlyOwner nonReentrant {
        require(_whitelisted[account], "TimahToken: Account not whitelisted");

        _whitelisted[account] = false;
        if (totalWhitelistedCount > 0) {
            totalWhitelistedCount -= 1;
        }

        emit WhitelistUpdated(account, false, msg.sender, block.timestamp);
    }

    /**
     * @notice Batch add multiple accounts to whitelist.
     * @param accounts Array of addresses to whitelist
     */
    function batchAddToWhitelist(address[] calldata accounts) external onlyOwner nonReentrant {
        uint256 count = 0;
        for (uint256 i = 0; i < accounts.length; i++) {
            address acc = accounts[i];
            if (acc != address(0) && !_whitelisted[acc]) {
                _whitelisted[acc] = true;
                count++;
                emit WhitelistUpdated(acc, true, msg.sender, block.timestamp);
            }
        }
        totalWhitelistedCount += count;
        emit BatchWhitelistUpdated(count, true, msg.sender, block.timestamp);
    }

    /**
     * @notice Checks whether an address is whitelisted.
     * @param account Address to check
     * @return bool Whitelist status
     */
    function isWhitelisted(address account) external view returns (bool) {
        return _whitelisted[account];
    }

    // ==========================================
    // MINTING & BURNING FUNCTIONS
    // ==========================================

    /**
     * @notice Mints new tokens to any address (Restricted to Owner only).
     * @dev Secured with onlyOwner, nonReentrant, and Pausable check.
     * @param to Target address to receive tokens
     * @param amount Amount of tokens to mint (in wei)
     */
    function mint(address to, uint256 amount)
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        require(to != address(0), "TimahToken: Cannot mint to zero address");
        require(amount > 0, "TimahToken: Mint amount must be greater than zero");
        require(totalSupply() + amount <= MAX_SUPPLY_CAP, "TimahToken: Minting exceeds max supply cap");

        _mint(to, amount);

        emit TokensMinted(to, amount, msg.sender, totalSupply(), block.timestamp);
    }

    /**
     * @notice Mints tokens specifically to a verified Whitelisted user (Restricted to Owner only).
     * @dev Adds extra whitelist verification layer for exclusive distribution.
     * @param to Whitelisted target address
     * @param amount Amount to mint
     */
    function mintWhitelisted(address to, uint256 amount)
        external
        onlyOwner
        onlyWhitelisted(to)
        whenNotPaused
        nonReentrant
    {
        require(to != address(0), "TimahToken: Cannot mint to zero address");
        require(amount > 0, "TimahToken: Mint amount must be greater than zero");
        require(totalSupply() + amount <= MAX_SUPPLY_CAP, "TimahToken: Minting exceeds max supply cap");

        _mint(to, amount);

        emit TokensMinted(to, amount, msg.sender, totalSupply(), block.timestamp);
    }

    /**
     * @notice Overridden burn function with custom event logging and reentrancy protection.
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public override whenNotPaused nonReentrant {
        require(amount > 0, "TimahToken: Burn amount must be greater than zero");
        super.burn(amount);
        emit TokensBurned(msg.sender, amount, totalSupply(), block.timestamp);
    }

    /**
     * @notice Overridden burnFrom function with custom event logging and reentrancy protection.
     * @param account Target account from which tokens are burned
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address account, uint256 amount) public override whenNotPaused nonReentrant {
        require(amount > 0, "TimahToken: Burn amount must be greater than zero");
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount, totalSupply(), block.timestamp);
    }

    // ==========================================
    // EMERGENCY PAUSE / UNPAUSE CONTROL
    // ==========================================

    /**
     * @notice Pauses all token transfers, minting, and burning in case of security emergency.
     * @param reason Security justification for emergency pause
     */
    function pause(string calldata reason) external onlyOwner nonReentrant {
        _pause();
        emit EmergencyPauseTriggered(msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Unpauses token transfers and resumes normal operation.
     */
    function unpause() external onlyOwner nonReentrant {
        _unpause();
        emit EmergencyUnpauseTriggered(msg.sender, block.timestamp);
    }

    /**
     * @notice Logs security anomalies detected by external off-chain monitoring nodes.
     * @param target Address associated with suspicious activity
     * @param anomalyType Description of anomaly
     * @param value Associated transaction value
     */
    function flagSecurityAnomaly(address target, string calldata anomalyType, uint256 value)
        external
        onlyOwner
    {
        emit SecurityAnomalyDetected(target, anomalyType, value, block.timestamp);
    }

    // ==========================================
    // INTERNAL OVERRIDES FOR OPENZEPPELIN V5
    // ==========================================

    /**
     * @dev Overrides _update function required by ERC20 and ERC20Pausable in OpenZeppelin v5.x.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}

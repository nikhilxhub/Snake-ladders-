# 🎲 Stake & Ladderss

A decentralized multiplayer **Snake & Ladders-inspired game** built on **Solana Anchor** with a **Next.js frontend**.  
Players stake entry fees, pay per dice roll, and compete to reach block 100 first — winner takes the pot!

---
![Stake Ladders Demo](./stakeladders.mp4)
## 🚀 Features

- **Room Creation**  
  - A player creates a game room with:
    - Entry fee (SOL)
    - Number of players
    - Price per dice roll  
  - A unique `roomId` is generated (handled via Next.js dynamic route: `room/[id]/page.tsx`).

- **Joining Rooms**  
  - Other players can join via the room link.  
  - Entry fee must be paid to join.  
  - Players are added to the room on-chain.

- **Game Start**  
  - Room creator has a **Start Game** button.  
  - Once started, turns are managed by the Solana program.

- **Gameplay Mechanics**  
  - Player positions are stored on-chain (no cheating possible).  
  - On their turn, a player can:
    1. **Roll the Dice** → Pay the per-roll fee, get a random value (1–6).  
    2. **Skip Turn** → Pass to the next player.  
  - Dice rolls and skips are enforced by the Solana program.

- **Winning Condition**  
  - All entry fees + dice roll fees accumulate in the **pot**.  
  - First player to reach **block 100** wins the pot.

---

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)  
- **Blockchain**: [Solana](https://solana.com/)  
- **Smart Contracts**: [Anchor Framework](https://book.anchor-lang.com/)  
- **Wallet Integration**: Phantom / Solana Wallet Adapter  

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (>= 18)  
- Yarn or npm  
- Solana CLI  
- Anchor CLI  
- Phantom Wallet  

### Steps
1. **Clone the repo**
   ```bash
   git clone https://github.com/nikhilxhub/Snake-ladders-.git
   cd stake-ladderss
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure Solana**
   ```bash
   solana config set --url devnet
   solana airdrop 2
   ```

4. **Build & Deploy Anchor Program**
   ```bash
   cd programs/stake_ladderss
   anchor build
   anchor deploy
   ```

5. **Run Next.js frontend**
   ```bash
   cd ../..
   yarn dev
   ```

---

## 🎮 How to Play

1. **Create a Room**  
   - Set entry fee, number of players, and price per roll.  
   - Share the room link.  

2. **Join a Room**  
   - Pay the entry fee to join.  
   - Wait for the game to start.  

3. **Play Turns**  
   - Roll the dice (pay per roll fee) or skip.  
   - Move forward based on dice roll.  
   - Positions are tracked on-chain.  

4. **Win the Pot**  
   - First player to reach block 100 wins all accumulated fees.  

---

## 🔒 Fairness & Security

- All game logic (positions, dice rolls, pot distribution) is enforced by the **Solana Anchor program**.  
- No centralized server → **No cheating possible**.  
- Transparent, verifiable gameplay.  

---

## 📜 License

MIT License © 2025 Stake & Ladderss
```

---


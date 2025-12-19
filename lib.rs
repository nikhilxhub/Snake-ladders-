use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    system_instruction,
    sysvar::instructions as instructions_sysvar,
};

declare_id!("AKyrBmNVw7iAjz9GJ5GkZui2UDtF1VBHnp82pqqvV7qb");


pub const DEFAULT_WIN_POSITION: u8 = 100;
pub const MAX_PLAYERS: usize = 8;
pub const MAX_MAP_SIZE: usize = 20;

// Account space estimate
pub const GAME_ACCOUNT_SPACE: usize =
    8 + 32 + // creator
    32 +     // game_id
    1 +      // max_players
    4 + (32 * MAX_PLAYERS) + // players vec
    (1 * MAX_PLAYERS) +      // positions array
    8 +  // entry_fee_lamports
    8 +  // roll_fee_lamports
    8 +  // total_pot
    1 +  // current_turn_index
    8 +  // turn_nonce
    1 +  // win_position
    1 + 1 + // state enum + finished bool
    33 +     // winner Option (1 + 32)
    32 +     // last_anchor

    1 +      // bump
    (1 * MAX_MAP_SIZE) + // map_from
    (1 * MAX_MAP_SIZE) + // map_to
    1 +      // map_len
    33;      // pending_player Option (1 + 32)


#[program]
pub mod ladders {
    use super::*;
    use anchor_lang::solana_program::program::{invoke, invoke_signed};
    use std::str::FromStr;

    pub fn create_game(
        ctx: Context<CreateGame>,
        game_id: [u8; 32],
        max_players: u8,
        entry_fee_lamports: u64,
        roll_fee_lamports: u64,

    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            max_players as usize <= MAX_PLAYERS,
            ErrorCode::TooManyPlayers
        );

        game.creator = *ctx.accounts.creator.key;
        game.game_id = game_id;
        game.max_players = max_players;
        game.entry_fee_lamports = entry_fee_lamports;
        game.roll_fee_lamports = roll_fee_lamports;
        game.state = GameState::Created;
        game.players = vec![];
        game.positions = [0u8; MAX_PLAYERS];
        game.total_pot = 0;
        game.current_turn_index = 0;
        game.turn_nonce = 0;
        game.win_position = DEFAULT_WIN_POSITION;
        game.finished = false;
        game.winner = None;
        game.last_anchor = [0u8; 32];
        // game.er_pubkey = er_pubkey;
        game.pending_player = None;
        game.bump = ctx.bumps.game;

        // Initialize map (Snake and Ladder definitions)
        let from_locs: [u8; 15] = [1, 4, 8, 21, 28, 32, 36, 48, 50, 62, 71, 80, 88, 95, 97];
        let to_locs:   [u8; 15] = [38, 14, 30, 42, 76, 10, 6, 26, 67, 18, 92, 99, 24, 56, 78];

        for i in 0..15usize {
            game.map_from[i] = from_locs[i];
            game.map_to[i] = to_locs[i];
        }
        game.map_len = 15u8;

        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        let caller = ctx.accounts.player.key();

        // Transfer entry fee if applicable
        if ctx.accounts.game.entry_fee_lamports > 0 {
            let ix = system_instruction::transfer(
                &caller,
                &ctx.accounts.game.key(),
                ctx.accounts.game.entry_fee_lamports,
            );
            invoke(
                &ix,
                &[
                    ctx.accounts.player.to_account_info(),
                    ctx.accounts.game.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;
        }

        // FIX 1: Read lamports BEFORE borrowing game mutably
        let current_pot = **ctx.accounts.game.to_account_info().lamports.borrow();

        // Now borrow game mutably
        let game = &mut ctx.accounts.game;

        require!(game.state == GameState::Created, ErrorCode::GameAlreadyStarted);
        require!((game.players.len() as u8) < game.max_players, ErrorCode::GameFull);
        require!(!game.players.iter().any(|p| p == &caller), ErrorCode::AlreadyJoined);

        // Assign the value we read earlier
        game.total_pot = current_pot;
        game.players.push(caller);
        
        Ok(())
    }

    pub fn start_game(ctx: Context<StartGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.creator == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        require!(game.state == GameState::Created, ErrorCode::GameAlreadyStarted);
        require!(game.players.len() > 0, ErrorCode::NoPlayers);
        
        game.state = GameState::Started;
        Ok(())
    }

    pub fn deposit_fee(ctx: Context<DepositFee>, amount: u64) -> Result<()> {
        let payer_key = ctx.accounts.payer.key();
        let ix = system_instruction::transfer(&payer_key, &ctx.accounts.game.key(), amount);
        
        invoke(
            &ix,
            &[
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.game.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // FIX 2: Read lamports BEFORE borrowing game mutably
        let current_pot = **ctx.accounts.game.to_account_info().lamports.borrow();

        let game = &mut ctx.accounts.game;
        require!(!game.finished, ErrorCode::GameFinished);
        
        game.total_pot = current_pot;
        Ok(())
    }


    pub fn request_roll(ctx: Context<RequestRoll>) -> Result<()> {
        let player_key = ctx.accounts.player.key();

        // 1. Transfer roll fee
        if ctx.accounts.game.roll_fee_lamports > 0 {
            let ix = system_instruction::transfer(
                &player_key,
                &ctx.accounts.game.key(),
                ctx.accounts.game.roll_fee_lamports,
            );
            invoke(
                &ix,
                &[
                    ctx.accounts.player.to_account_info(),
                    ctx.accounts.game.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;
        }

        // Get updated pot balance
        let current_pot = **ctx.accounts.game.to_account_info().lamports.borrow();

        let game = &mut ctx.accounts.game;

        // 2. Validation
        require!(game.state == GameState::Started, ErrorCode::GameNotStarted);
        require!(!game.finished, ErrorCode::GameFinished);
        require!(
            game.players[game.current_turn_index as usize] == player_key,
            ErrorCode::NotYourTurn
        );

        // Update pot
        game.total_pot = current_pot;

        // 3. Generate Random Number (Pseudo-random)
        // Using clock and slot for randomness as requested (simulating client-side simplicity)
        let clock = Clock::get()?;
        let seed = clock.unix_timestamp
            .wrapping_add(clock.slot as i64)
            .wrapping_add(game.turn_nonce as i64);
        let roll = ((seed % 6).abs() + 1) as u8;

        msg!("Player rolled: {}", roll);

        // 4. Update Position
        let current_pos_idx = game.current_turn_index as usize;
        let mut new_pos = game.positions[current_pos_idx] + roll;

        if new_pos > game.win_position {
            msg!("Rolled too high! Staying at current position.");
            new_pos = game.positions[current_pos_idx];
        } else {
            // Handle Snakes and Ladders
            for i in 0..game.map_len as usize {
                if game.map_from[i] == new_pos {
                    msg!("Landed on snake/ladder! Moving from {} to {}", new_pos, game.map_to[i]);
                    new_pos = game.map_to[i];
                    break;
                }
            }

            // Check Win Condition
            if new_pos == game.win_position {
                game.finished = true;
                game.winner = Some(player_key);
                game.state = GameState::Finished;
                msg!("Player {} wins!", player_key);
            }
        }

        game.positions[current_pos_idx] = new_pos;

        // 5. Advance Turn
        if !game.finished {
            game.current_turn_index = (game.current_turn_index + 1) % (game.players.len() as u8);
        }
        
        game.turn_nonce = game.turn_nonce.wrapping_add(1);

        Ok(())
    }



    pub fn pass_turn(ctx: Context<PassTurn>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.state == GameState::Started, ErrorCode::GameNotStarted);
        require!(!game.finished, ErrorCode::GameFinished);

        let caller = ctx.accounts.player.key();
        require!(!game.players.is_empty(), ErrorCode::NoPlayers);
        let expected_player = game.players[game.current_turn_index as usize];
        
        require!(expected_player == caller, ErrorCode::Unauthorized);

        game.pending_player = None;
        if !game.players.is_empty() {
            game.current_turn_index = ((game.current_turn_index as usize + 1) % game.players.len()) as u8;
        }
        game.turn_nonce = game.turn_nonce.checked_add(1).ok_or(ErrorCode::NonceOverflow)?;
        Ok(())
    }

    pub fn claim_prize(ctx: Context<ClaimPrize>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let winner = &mut ctx.accounts.winner;

        // 1. Checks

        require!(game.state == GameState::Finished, ErrorCode::GameNotFinished);
        require!(game.winner == Some(winner.key()), ErrorCode::Unauthorized);
        require!(game.total_pot > 0, ErrorCode::InvalidWinner);

        // 2. Calculate Payout
        // We leave a tiny amount (rent) to keep the account alive, 
        // or we can close the account entirely. Here we transfer everything available.
        // To be safe, we usually leave the "Rent Exemption" amount, but for simplicity:
        let amount = game.total_pot;

        msg!("Winner found! Transferring {} lamports to {:?}", amount, winner.key());

        // 3. The Transfer Logic (PDA to User)
        // Since the Game Account is a PDA (Program Derived Address), it must "sign" for itself.
        // We don't use system_instruction::transfer because the PDA has no private key.
        // We manipulate the lamports directly.
        
        **game.to_account_info().try_borrow_mut_lamports()? -= amount;
        **winner.to_account_info().try_borrow_mut_lamports()? += amount;

        // 4. Update State
        game.total_pot = 0;
        
        // Optional: Reset game or close account? 
        // For now, we just leave it empty.
        
        Ok(())
    }
}

// ... Data Structures and Contexts remain the same ...
// (Included below for completeness if you are copy-pasting the whole file)

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameState {
    Created,
    Started,
    Finished,
}

#[account]
pub struct Game {
    pub creator: Pubkey,
    pub game_id: [u8; 32],
    pub max_players: u8,
    pub players: Vec<Pubkey>, 
    pub positions: [u8; MAX_PLAYERS],

    pub entry_fee_lamports: u64,
    pub roll_fee_lamports: u64,
    pub total_pot: u64,

    pub current_turn_index: u8,
    pub turn_nonce: u64,
    pub win_position: u8,

    pub state: GameState,
    pub finished: bool,
    pub winner: Option<Pubkey>,

    pub last_anchor: [u8; 32],

    pub bump: u8,

    pub map_from: [u8; MAX_MAP_SIZE],
    pub map_to: [u8; MAX_MAP_SIZE],
    pub map_len: u8,

    pub pending_player: Option<Pubkey>,
}

#[derive(Accounts)]
#[instruction(game_id: [u8; 32])]
pub struct CreateGame<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = GAME_ACCOUNT_SPACE,
        seeds = [b"game", creator.key().as_ref(), &game_id],
        bump
    )]
    pub game: Account<'info, Game>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut, 
        seeds = [b"game", game.creator.key().as_ref(), &game.game_id], 
        bump = game.bump
    )]
    pub game: Account<'info, Game>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StartGame<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut, constraint = game.creator == authority.key())]
    pub game: Account<'info, Game>,
}

#[derive(Accounts)]
pub struct DepositFee<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub game: Account<'info, Game>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PassTurn<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub game: Account<'info, Game>,
}

#[derive(Accounts)]
pub struct RequestRoll<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"game", game.creator.key().as_ref(), &game.game_id],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct ClaimPrize<'info> {
    // The winner who is claiming the money
    #[account(mut)]
    pub winner: Signer<'info>,

    #[account(
        mut,
        // Verify this is the correct game account
        seeds = [b"game", game.creator.key().as_ref(), &game.game_id],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Too many players")]
    TooManyPlayers,
    #[msg("Game is already finished")]
    GameFinished,
    #[msg("Game is full")]
    GameFull,
    #[msg("Player already joined")]
    AlreadyJoined,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("ER signer not authorized")]
    UnauthorizedER,
    #[msg("Invalid nonce")]
    InvalidNonce,
    #[msg("Invalid winner")]
    InvalidWinner,
    #[msg("No players in game")]
    NoPlayers,
    #[msg("Invalid turn index")]
    InvalidTurnIndex,
    #[msg("Not your turn")]
    NotYourTurn,
    #[msg("Nonce overflow")]
    NonceOverflow,
    #[msg("Mover is not in game")]
    InvalidMover,
    #[msg("Mover mismatch with pending")]
    MoverMismatch,
    #[msg("Game has already started, cannot join now")]
    GameAlreadyStarted,
    #[msg("Game has not started yet")]
    GameNotStarted,
    #[msg("Invalid VRF Program ID")]
    InvalidVrfProgram,
    #[msg("Game is not finished yet")]
GameNotFinished,
}
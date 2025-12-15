import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
// import { SnakeLaddersProgram } from "@/program_type"; // Assuming you have this or generated types
import IDL from "@/idl.json";
import { Ladders } from "@/program_type";

// Program ID from your IDL or environment
export const PROGRAM_ID = new PublicKey("AKyrBmNVw7iAjz9GJ5GkZui2UDtF1VBHnp82pqqvV7qb");

export const getProgram = (connection: Connection, wallet: any) => {
    const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });
    return new Program<Ladders>(IDL as any, provider);
};

export const getGamePDA = (creator: PublicKey, gameId: number[]) => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("game"),
            creator.toBuffer(),
            Buffer.from(gameId),
        ],
        PROGRAM_ID
    );
};

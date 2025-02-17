import { Connection, PublicKey, clusterApiUrl, Commitment } from "@solana/web3.js";
import { Program, AnchorProvider, web3, Wallet } from "@project-serum/anchor";
import idl from './../../../static/data/metadata/idl.json';
import { Idl } from "@project-serum/anchor";
// import { sign } from "crypto";

const { SystemProgram } = web3;

const programID = new PublicKey("your_program_id");
const tokenProgramID = new PublicKey("your_token_program_id");
const mint = new PublicKey("your_mint_id");
const network = clusterApiUrl("mainnet-beta");
const opts = {
    preflightCommitment: "processed" as Commitment
};

async function welcomeInstruction(signer: Wallet, tokenAccount: PublicKey) {
    const connection = new Connection(network, { commitment: opts.preflightCommitment });
    const provider = new AnchorProvider(connection, signer, opts); 
    const program = new Program(idl as Idl, programID, provider);

    // Your interaction logic here
    // Send transaction
    const txHash = await program.methods
    .welcome()
    .accounts({
        signer: signer.publicKey,
        mint: mint,
        account: tokenAccount,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: tokenProgramID,
    })
    .signers([signer.payer])
    .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    return txHash
}

// Call the function (example)
// welcomeInstruction();
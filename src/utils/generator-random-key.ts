import { env } from "@/env";
import "dotenv/config"

export function generatoRandomKey(length: number) {
    let result = '';
    const characters = env.CHARACTERS;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const key = Buffer.from(result, 'base64').toString('base64')
    
    return key;
  }
import { DefaultMsgResponse } from './../types/DefaultMsgResponse';
import handler from "@/pages/api/hello";
import mongoose from "mongoose";
import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";

export const connectToDb = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<DefaultMsgResponse>) => {
        console.log("DB está conectado:", mongoose.connections[0].readyState === 1 ? "Sim" : "Não");
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        const { DB_CONNECTION_STRING } = process.env;
        if (!DB_CONNECTION_STRING) {
            console.log("DB_CONNECTION_STRING invalida")
            return res.status(500).json({ error: "DB_CONNECTION_STRING invalida" });
        }
        mongoose.connection.on("connected", () => console.log("Conectando ao banco"))
        mongoose.connection.on("error", () => console.log("erro ao conectar"))
        await mongoose.connect(DB_CONNECTION_STRING);

        return handler(req, res);
        
    }
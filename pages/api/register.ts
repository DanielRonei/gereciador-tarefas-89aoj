import { connectToDB } from './../../middlewares/connectToDB';
import { DefaultMessageResponse } from './../../types/DefaultMessageResponse';
import type {NextApiRequest, NextApiResponse} from 'next';
import { UserModel } from '@/models/User';
import CryptoJs from 'crypto-js';

type Register = {
    name: string,
    email: string,
    password : string
}

const handler = async (req : NextApiRequest, res : NextApiResponse<DefaultMessageResponse>) => {
    try {
        if(req.method !== 'POST'){
            return res.status(405).json({error: 'Método solicitado não existe!'});
        }

        const {MY_SUPER_SECRET_KEY} = process.env;
        if(!MY_SUPER_SECRET_KEY){
            console.log('ENV MY_SUPER_SECRET_KEY não preenchida');
            return res.status(500).json({error : 'ENV MY_SUPER_SECRET_KEY não preenchida'});
        }

        const {name, email, password} = req.body as Register;

        if(!name || name.trim().length < 2 ){
            return res.status(400).json({error: 'Nome inválido!'});
        }

        if(!email || email.trim().length < 6 || !email.includes('@') || !email.includes('.')){
            return res.status(400).json({error: 'Email inválido!'});
        }

        const existsUser = await UserModel.findOne({email});
        if(existsUser){
            return res.status(400).json({error: 'Email já cadastrado!'});
        }

        if(!password || password.trim().length < 4 ){
            return res.status(400).json({error: 'Senha inválida!'});
        }

        const passwordCyphered = CryptoJs.AES.encrypt(password, MY_SUPER_SECRET_KEY).toString();

        const user = {
            name,
            email,
            password: passwordCyphered
        };

        await UserModel.create(user);

        return res.status(200).json({msg: 'Usuário cadastrado!'});
    } catch (ex) {
        console.log('Ocorreu erro ao cadastrar usuário:', ex);
        res.status(500).json({error: 'Ocorreu erro ao cadastrar usuário, tente novamente!'});
    }
}

export default connectToDB(handler);
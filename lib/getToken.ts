import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

export default async function getToken(request:NextRequest) {
    try {
        console.log("get token function runned");
        
        const token = request.cookies.get("token")?.value || ""

        console.log("token",token);

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET!)
        
        console.log("decodedToken :",decodedToken);

        return decodedToken
    } catch (error) {
        throw new Error(error)
    }
}
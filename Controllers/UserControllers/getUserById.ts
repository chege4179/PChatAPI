import {Request, Response} from "express";
import prisma from "../../config/database";

const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const user = await prisma.account.findUnique({
            where: {
                userId: id
            },
        })
        const sentMessages = await prisma.message.findMany({
            where:{
                senderId:id,
            }
        })
        const receivedMessages = await  prisma.message.findMany({
            where:{
                receiverId:id
            }
        })
        const receiverIds = sentMessages.map((message) => message.receiverId)
        const senderIds = sentMessages.map((message) => message.senderId)
        const receiverIds2 = receivedMessages.map((message) => message.receiverId)
        const senderIds2 = receivedMessages.map((message) => message.senderId)
        const chatUserIds = receiverIds.concat(senderIds,receiverIds2,senderIds2)
        const uniqueChatIds = Array.from(new Set(chatUserIds))
             .filter((userId) => userId !== id )
        const chatUsers = await prisma.account.findMany({
            where:{
                userId:{
                    in:uniqueChatIds
                }
            },
        })
        if (user == null) {
            return res.json({
                msg: "This user does not exist",
                success: true,
                user: null,
                chats:null,
            })
        } else {
            return res.json({
                msg: "User fetched successfully",
                success: true,
                user,
                chats:chatUsers
            })
        }

    } catch (e) {
        console.log(e)
        return res.json({
            msg: "An unexpected error occurred",
            success: false,
            user:null,
            chats:null,
        })
    }
}
export default getUserById

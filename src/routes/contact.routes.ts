import { FastifyInstance } from "fastify";
import { ContactUseCase } from "../usecases/contact.usecase";
import { ContactCreate } from "../interfaces/contacts.interface";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function contactRoutes(fastify: FastifyInstance) {
    const contactUseCase = new ContactUseCase()

    fastify.addHook('preHandler', authMiddleware)

    fastify.post<{ Body: ContactCreate }>('/', async (req, reply) => {
        const { name, email, phone } = req.body
        const emailUser = req.headers['email']

        try {
            const data = await contactUseCase.create({
                name, 
                email, 
                phone, 
                userEmail: emailUser
            })
            return reply.send(data)
        } catch (error) {
            reply.send(error)
        }
    })

    fastify.get('/', async (req, reply) => {
        const emailUser = req.headers['email']

        try {
            const data = await contactUseCase.listAllContacts(emailUser)
            return reply.send(data)
        } 
        catch (error) {
            reply.send(error)
        }
    })

    // falta criar as rotas de update e delete de contato
}
import { ContactCreate, ContactRepository } from "../interfaces/contacts.interface";
import { UserRepository } from "../interfaces/user.interface";
import { ContactRepositoryPrisma } from "../repositories/contacts.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class ContactUseCase {

    private contactRepository: ContactRepository 
    private userRepository: UserRepository

    constructor() {
        this.contactRepository = new ContactRepositoryPrisma
        this.userRepository = new UserRepositoryPrisma
    }

    async create({
        userEmail, 
        name, 
        email, 
        phone
    }: ContactCreate) {

        const user = await this.userRepository.findByEmail(userEmail)

        if(!user) {
            throw new Error('User not found!')
        }

        const verifyIfExistsContact = 
            await this.contactRepository.findByEmailOrPhone(email, phone)

        if(verifyIfExistsContact) {
            throw new Error('Contact already exists!')
        }

        const contact = await this.contactRepository.create({
            email,
            name, 
            phone,
            userId: user.id,
        })
        return contact
    }

    async listAllContacts(userEmail: string) {
        const user = await this.userRepository.findByEmail(userEmail)

        if(!user) {
            throw new Error('User not found!')
        }

        const contacts = await this.contactRepository.findAllContacts(user.id)

        return contacts
    }
}

export { ContactUseCase }
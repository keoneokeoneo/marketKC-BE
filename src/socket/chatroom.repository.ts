import { EntityRepository, Repository } from 'typeorm';
import { ChatRoom } from './chatroom.entity';

@EntityRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {}

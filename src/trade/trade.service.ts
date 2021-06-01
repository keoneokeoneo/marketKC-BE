import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getDiff } from 'src/dateFormat';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Trade } from './trade.entity';
import { TradeRepository } from './trade.repository';
import { CreateTradeReq } from './trade.type';
import { TradeRequest } from './tradeRequest.entity';
import { TradeRequestRepository } from './tradeRequest.repository';
import { TradeTX } from './tradeTX.entity';
import { TradeTXRepository } from './tradeTX.repository';

export interface CreateTX {
  tradeID: number;
  postID: number;
  txHash: string;
  senderID: string;
  receiverID: string;
  eventName: string;
  stage: 'Waiting' | 'Done' | 'Rejected';
}

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradeTX)
    private tradeTXRepository: TradeTXRepository,
    @InjectRepository(TradeRequest)
    private tradeRequestRepository: TradeRequestRepository,
    @InjectRepository(Trade)
    private tradeRepository: TradeRepository,
    private postServce: PostService,
    private userService: UserService,
  ) {}

  async createRequest(
    postID: number,
    chatID: number,
    senderID: string,
    receiverID: string,
  ) {
    return await this.tradeRequestRepository.save({
      postID: postID,
      chatID: chatID,
      senderID: senderID,
      receiverID: receiverID,
    });
  }

  async getRequestByChatID(chatID: number) {
    return await this.tradeRequestRepository.findOne({
      chatID: chatID,
    });
  }

  async answerRequest(id: number, answer: boolean) {
    await this.tradeRequestRepository.update({ id: id }, { accepted: answer });
    return await this.tradeRequestRepository.findOne({ id: id });
  }

  async getRequestsByUser(userID: string) {
    const requests = await this.tradeRequestRepository.find({
      where: [{ receiverID: userID }, { senderID: userID }],
    });

    if (requests.length < 1) return [];

    const res = await Promise.all(
      requests.map(async (req) => {
        const post = await this.postServce.getPost(req.postID);
        return {
          id: req.id,
          chatID: req.chatID,
          senderID: req.senderID,
          receiverID: req.receiverID,
          accepted: req.accepted,
          post: {
            id: post.id,
            title: post.title,
            price: post.price,
            location: post.location.split(' ')[2],
            status: post.status,
            updatedAt: getDiff(post.updatedAt),
            seller: {
              id: post.seller.id,
              name: post.seller.name,
            },
            postImg: post.postImgs[0].url,
            chats: post.chatrooms.length,
          },
        };
      }),
    );
    return res;
  }

  async getTradesByUser(userID: string) {
    const trades = await this.tradeRepository.find({
      where: [{ sellerID: userID }, { buyerID: userID }],
    });
    if (trades.length < 1) return [];

    const res = await Promise.all(
      trades.map(async (trade) => {
        const post = await this.postServce.getPost(trade.postID);
        return {
          id: trade.id,
          stage: trade.stage,
          buyer: {
            id: trade.buyerID,
            name: trade.buyerName,
            addr: trade.from,
          },
          seller: {
            id: trade.sellerID,
            name: trade.sellerName,
            addr: trade.to,
          },
          post: {
            id: post.id,
            title: post.title,
            price: post.price,
            location: post.location.split(' ')[2],
            status: post.status,
            updatedAt: getDiff(post.updatedAt),
            seller: {
              id: post.seller.id,
              name: post.seller.name,
            },
            postImg: post.postImgs[0].url,
            chats: post.chatrooms.length,
          },
        };
      }),
    );
    return res;
  }

  async createTrade(req: CreateTradeReq) {
    const {
      buyerID,
      sellerID,
      buyerName,
      from,
      postID,
      price,
      sellerName,
      to,
    } = req;
    await this.postServce.updateStatus(postID, '거래중');
    return await this.tradeRepository.save({
      price: price,
      from: from,
      to: to,
      postID: postID,
      buyerID: buyerID,
      sellerID: sellerID,
      buyerName: buyerName,
      sellerName: sellerName,
    });
  }

  async updateTrade(id: number, stage: 'Waiting' | 'Done' | 'Rejected') {
    return await this.tradeRepository.update({ id: id }, { stage: stage });
  }

  async saveTX(req: CreateTX) {
    const { eventName, txHash, tradeID, postID, receiverID, senderID } = req;
    return await this.tradeTXRepository.save({
      tradeID: tradeID,
      postID: postID,
      txHash: txHash,
      senderID: senderID,
      receiverID: receiverID,
      eventName: eventName,
    });
  }

  async getUserTX(userID: string) {
    const txs = await this.tradeTXRepository.find({
      where: [{ senderID: userID }, { receiverID: userID }],
    });

    if (txs.length < 1) return [];

    const res = await Promise.all(
      txs.map(async (tx) => {
        const post = await this.postServce.getPost(tx.postID);
        const sender = await this.userService.getUserByID(tx.senderID);
        const receiver = await this.userService.getUserByID(tx.receiverID);

        return {
          id: tx.id,
          txHash: tx.txHash,
          eventName: tx.eventName,
          sender: {
            id: sender.id,
            name: sender.name,
            addr: sender.walletAddr,
          },
          receiver: {
            id: receiver.id,
            name: receiver.name,
            addr: receiver.walletAddr,
          },
          post: {
            id: post.id,
            title: post.title,
            price: post.price,
            location: post.location.split(' ')[2],
            status: post.status,
            updatedAt: getDiff(post.updatedAt),
            seller: {
              id: post.seller.id,
              name: post.seller.name,
            },
            postImg: post.postImgs[0].url,
            chats: post.chatrooms.length,
          },
        };
      }),
    );
    return res;
  }
}

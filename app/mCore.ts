import { and, eq, inArray } from "drizzle-orm";
import { DB, Message } from "./base";
import { unreadMessage } from "./uCore";

// 增加消息
export async function mAdd(uid: number, type: number, time: number, pid: number) {
    try {
        const message = (await DB
            .insert(Message)
            .values({
                uid,
                type,
                time,
                pid,
            })
            .returning({ uid: Message.uid })
        )?.[0]
        if (message) {
            (type == 1) && unreadMessage(message.uid, 1) // 增加未读回复计数
        }
    } catch (error) {
        console.error('插入失败:', error);
        // 如果插入失败则提醒 因为发帖时只运行一次 应该不会有冲突 但以防万一
    }
}

// 删除消息
export async function mDel(uid: number, type: number[], time: number, pid: number) {
    try {
        const message = (await DB
            .delete(Message)
            .where(and(
                eq(Message.uid, uid),
                inArray(Message.type, type),
                eq(Message.time, time),
                eq(Message.pid, pid),
            ))
            .returning({ uid: Message.uid, type: Message.type })
        )?.[0]
        if (message) {
            (message.type == 1) && unreadMessage(message.uid, -1) // 减少未读回复计数
        }
    } catch (error) {
        console.error('删除失败:', error);
        // 如果记录已经被删除 也不会报错 但以防万一
    }
}

// 已读消息 type也可输入负数 从已读切换到未读
export async function mRead(uid: number, type: number, time: number, pid: number) {
    try {
        const message = (await DB
            .update(Message)
            .set({
                type: -type,
            })
            .where(and(
                eq(Message.uid, uid),
                eq(Message.type, type),
                eq(Message.time, time),
                eq(Message.pid, pid),
            ))
            .returning({ uid: Message.uid })
        )?.[0]
        if (message) {
            type == -1 && unreadMessage(uid, 1) // 已读变未读
            type == 1 && unreadMessage(uid, -1) // 未读变已读
        }
    } catch (error) {
        console.error('切换失败:', error);
    }
}

// 全部设置已读
export async function mClear(uid: number, type: number) {
    try {
        await DB
            .update(Message)
            .set({
                type: -type,
            })
            .where(and(
                eq(Message.uid, uid),
                eq(Message.type, type),
            ))
        unreadMessage(uid, null) // 清空所有消息
    } catch (error) {
        console.error('切换失败:', error);
    }
}

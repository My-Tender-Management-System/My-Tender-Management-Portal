export interface INotification {
    NotificationId?: string;
Title?: string;
Message?: string;
IsRead?: string;

}

export class NotificationDto implements INotification {
    constructor(
        public NotificationId?: string,
public Title?: string,
public Message?: string,
public IsRead?: string,

    ) {
    }
}

export namespace AppGlobalService {
  export var CurrentSession: any;
  export var CurrentUserRole: any;
  export var CurrentAssociate: any;
  export var CurrentEmployee: any;
  export var CurrentClient: any;
  export var CurrentUserDisplayName: any;
  export var CurrentIPAddress: string;
  export var IsPrimaryAssociate: boolean;
  export var CurrentUserId: any;
  export class ClientTimeZone {
    static GetTimezoneOffset(): string {
      return (String(new Date().getTimezoneOffset()));
    }
  }
}

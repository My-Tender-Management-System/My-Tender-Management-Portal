import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {environment} from "../environments/environment";
import { UserProfileComponent } from './layout/Userprofile/user-profile.component'; 
import { SelectRelationshipComponent } from './layout/select-relationship/select-relationship.component';
import { CamelCaseToTitlePipe } from './camel-case-to-title.pipe';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule, DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {BadgeModule} from 'primeng/badge';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipModule} from 'primeng/chip';
import {ChipsModule} from 'primeng/chips';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {GalleriaModule} from 'primeng/galleria';
import {ImageModule} from 'primeng/image';
import {InplaceModule} from 'primeng/inplace';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {KnobModule} from 'primeng/knob';
import {LightboxModule} from 'primeng/lightbox';
import {ListboxModule} from 'primeng/listbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {PanelMenuModule} from 'primeng/panelmenu';
import {PasswordModule} from 'primeng/password';
import {PickListModule} from 'primeng/picklist';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ScrollTopModule} from 'primeng/scrolltop';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {SkeletonModule} from 'primeng/skeleton';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SliderModule} from 'primeng/slider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SplitterModule} from 'primeng/splitter';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TimelineModule} from 'primeng/timeline';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {FullCalendarModule} from '@fullcalendar/angular';

// Application Components
import {AppCodeModule} from './blocks/app-code/app.code.component';
import {AppComponent} from './app.component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {AppMainComponent} from './app.main.component';
import {AppConfigComponent} from './app.config.component';
import {AppRightMenuComponent} from './app.rightmenu.component';
import {AppInlineMenuComponent} from './app.inlinemenu.component';
import {AppMenuComponent} from './app.menu.component';
import {AppMenuitemComponent} from './app.menuitem.component';
import {AppTopbarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {BlockViewer} from'./blocks/blockviewer/blockviewer.component';
import {BlocksComponent} from './blocks/blocks/blocks.component';
import {AuthHttpInterceptor, AuthModule, AuthService} from '@auth0/auth0-angular';

// Demo pages
import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import {FormLayoutDemoComponent} from './demo/view/formlayoutdemo.component';
import {FloatLabelDemoComponent} from './demo/view/floatlabeldemo.component';
import {InvalidStateDemoComponent} from './demo/view/invalidstatedemo.component';
import {InputDemoComponent} from './demo/view/inputdemo.component';
import {ButtonDemoComponent} from './demo/view/buttondemo.component';
import {TableDemoComponent} from './demo/view/tabledemo.component';
import {ListDemoComponent} from './demo/view/listdemo.component';
import {TreeDemoComponent} from './demo/view/treedemo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MediaDemoComponent} from './demo/view/mediademo.component';
import {MenusComponent} from './demo/view/menus/menus.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';
import {IconsComponent} from './utilities/icons.component';
import {AppCrudComponent} from './pages/app.crud.component';
import {AppCalendarComponent} from './pages/app.calendar.component';
import {AppTimelineDemoComponent} from './pages/app.timelinedemo.component';
import {AppInvoiceComponent} from './pages/app.invoice.component';
import {AppHelpComponent} from './pages/app.help.component';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
import {AppLoginComponent} from './pages/app.login.component';
import { ShowFilesComponent } from 'src/genPages/show-files/show-files.component';

// Demo services
import {CustomerServiceForDashboard} from './demo/service/customerservice';
import {EventServiceForDashboard} from './demo/service/eventservice';
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import { RoleConfigService } from '../services/role-config.service';

// Application services
import {MenuService} from './app.menu.service';
import {AppBreadcrumbService} from './app.breadcrumb.service';
import {ConfigService} from './demo/service/app.config.service';



// Generated Pages
import {UserComponent} from "../genPages/User/User.component"; 
import {RoleComponent} from "../genPages/Role/Role.component"; 
import {TenderComponent} from "../genPages/Tender/Tender.component"; 
import {UpdatesComponent} from "../genPages/Updates/Updates.component"; 
import {TenderTeamComponent} from "../genPages/TenderTeam/TenderTeam.component"; 
import {EquipmentsComponent} from "../genPages/Equipments/Equipments.component"; 
import {EvaluationCommitteeComponent} from "../genPages/EvaluationCommittee/EvaluationCommittee.component"; 
import {OtherRequirementsComponent} from "../genPages/OtherRequirements/OtherRequirements.component"; 
import {BidBondComponent} from "../genPages/BidBond/BidBond.component"; 
import {CompanyComponent} from "../genPages/Company/Company.component"; 
import {PerfomanceBondComponent} from "../genPages/PerfomanceBond/PerfomanceBond.component"; 
import {NotificationComponent} from "../genPages/Notification/Notification.component"; 
import {MemberComponent} from "../genPages/Member/Member.component"; 

import {CreateUpdateUser} from "./../genPages/User/create-update-user/create-update-user"; 
import {CreateUpdateRole} from "./../genPages/Role/create-update-role/create-update-role"; 
import {CreateUpdateTender} from "./../genPages/Tender/create-update-tender/create-update-tender"; 
import {CreateUpdateUpdates} from "./../genPages/Updates/create-update-updates/create-update-updates"; 
import {CreateUpdateTenderTeam} from "./../genPages/TenderTeam/create-update-tenderTeam/create-update-tenderTeam"; 
import {CreateUpdateEquipments} from "./../genPages/Equipments/create-update-equipments/create-update-equipments"; 
import {CreateUpdateEvaluationCommittee} from "./../genPages/EvaluationCommittee/create-update-evaluationCommittee/create-update-evaluationCommittee"; 
import {CreateUpdateOtherRequirements} from "./../genPages/OtherRequirements/create-update-otherRequirements/create-update-otherRequirements"; 
import {CreateUpdateBidBond} from "./../genPages/BidBond/create-update-bidBond/create-update-bidBond"; 
import {CreateUpdateCompany} from "./../genPages/Company/create-update-company/create-update-company"; 
import {CreateUpdatePerfomanceBond} from "./../genPages/PerfomanceBond/create-update-perfomanceBond/create-update-perfomanceBond"; 
import {CreateUpdateNotification} from "./../genPages/Notification/create-update-notification/create-update-notification"; 
import {CreateUpdateMember} from "./../genPages/Member/create-update-member/create-update-member"; 


// Generated Services
import {UserService} from "../services/User.service";  
import {RoleService} from "../services/Role.service";  
import {TenderService} from "../services/Tender.service";  
import {UpdatesService} from "../services/Updates.service";  
import {TenderTeamService} from "../services/TenderTeam.service";  
import {EquipmentsService} from "../services/Equipments.service";  
import {EvaluationCommitteeService} from "../services/EvaluationCommittee.service";  
import {OtherRequirementsService} from "../services/OtherRequirements.service";  
import {BidBondService} from "../services/BidBond.service";  
import {CompanyService} from "../services/Company.service";  
import {PerfomanceBondService} from "../services/PerfomanceBond.service";  
import {NotificationService} from "../services/Notification.service";  
import {MemberService} from "../services/Member.service";  
import { EquipmentDetailsComponent } from 'src/genPages/EquipmentDetails/EquipmentDetails.component';
import { CreateUpdateEquipmentDetails } from 'src/genPages/EquipmentDetails/create-update-equipmentDetails/create-update-equipmentDetails';
import { EquipmentDetailsService } from 'src/services/EquipmentDetails.service';
import { TenderProgressComponent } from 'src/genPages/tender-progress/tender-progress.component';
import { TeamComponent } from 'src/genPages/tender-progress/TenderTeam/TenderTeam.component';
import { PaymentsComponent } from 'src/genPages/payments/payments.component';
import { OtherPaymentsComponent } from 'src/genPages/OtherPayments/OtherPayments.component';
import { CreateUpdateOtherPayments } from 'src/genPages/OtherPayments/create-update-otherPayments/create-update-otherPayments';
import { OtherPaymentsService } from 'src/services/OtherPayments.service';
// import { RealationshipDailogComponent } from 'src/genPages/Tender/realationship-dailog/realationship-dailog.component';
import { DockModule } from 'primeng/dock';
// import { RelationshipDialogComponent } from 'src/genPages/Tender/realationship-dailog/realationship-dailog.component';
import { TenderRelatedComponent } from 'src/genPages/Tender/tender-related/tender-related.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        DatePipe,
        CommonModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarGroupModule,
        AvatarModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        DockModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        KnobModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        FullCalendarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TagModule,
        TerminalModule,
        TieredMenuModule,
        TimelineModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        NgxIntlTelInputModule,
        AppCodeModule,
        // Import the module into the application, with configuration
        AuthModule.forRoot({
  domain: environment.AUTH0DOMAIN,
      clientId: environment.AUTH0CLIENTID,
      authorizationParams: {
        redirect_uri: environment.REDIRECTURL
      }
        }),
    ],
    declarations: [
        AppComponent,
        AppBreadcrumbComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppConfigComponent,
        AppRightMenuComponent,
        AppInlineMenuComponent,
        AppTopbarComponent,
        AppFooterComponent,
        DashboardDemoComponent,
        FormLayoutDemoComponent,
        FloatLabelDemoComponent,
        InvalidStateDemoComponent,
        InputDemoComponent,
        ButtonDemoComponent,
        TableDemoComponent,
        ListDemoComponent,
        TreeDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MediaDemoComponent,
        MenusComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        DocumentationComponent,
        IconsComponent,
        AppCrudComponent,
        AppCalendarComponent,
        AppTimelineDemoComponent,
        AppLoginComponent,
        AppInvoiceComponent,
        AppHelpComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        BlockViewer,
        BlocksComponent,
        UserProfileComponent,
        SelectRelationshipComponent,
        CamelCaseToTitlePipe,
        ShowFilesComponent,

        // Generated Pages
        UserComponent,
		RoleComponent,
		TenderComponent,
		UpdatesComponent,
		TenderTeamComponent,
    TeamComponent,
		EquipmentsComponent,
		EvaluationCommitteeComponent,
		OtherRequirementsComponent,
		BidBondComponent,
		CompanyComponent,
		PerfomanceBondComponent,
		NotificationComponent,
		MemberComponent,
    EquipmentDetailsComponent,
    TenderProgressComponent,
    PaymentsComponent,
		OtherPaymentsComponent,
		TenderRelatedComponent,


        CreateUpdateUser,
CreateUpdateRole,
CreateUpdateTender,
CreateUpdateUpdates,
CreateUpdateTenderTeam,
CreateUpdateEquipments,
CreateUpdateEvaluationCommittee,
CreateUpdateOtherRequirements,
CreateUpdateBidBond,
CreateUpdateCompany,
CreateUpdatePerfomanceBond,
CreateUpdateNotification,
CreateUpdateMember,
CreateUpdateEquipmentDetails,
CreateUpdateOtherPayments,

        //--features--
        
    ],
    providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHttpInterceptor,
          multi: true,
        },
        {
              provide: Window,
              useValue: window,
            },
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        CustomerServiceForDashboard, EventServiceForDashboard, 
        MenuService, AppBreadcrumbService, ConfigService, DialogService,
        MessageService, ConfirmationService, RoleConfigService,
        // Generated Services
        UserService,
		RoleService,
		TenderService,
		UpdatesService,
		TenderTeamService,
		EquipmentsService,
		EvaluationCommitteeService,
		OtherRequirementsService,
		BidBondService,
		CompanyService,
		PerfomanceBondService,
		NotificationService,
		MemberService,
		EquipmentDetailsService,
		OtherPaymentsService,




    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

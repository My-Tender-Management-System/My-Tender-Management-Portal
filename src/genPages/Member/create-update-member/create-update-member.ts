// import { Component, OnDestroy, OnInit } from "@angular/core";
// import { MessageService } from "primeng/api";
// import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// import { filter, finalize, map, Subscription } from "rxjs";
// import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
// import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

// import {
//     SearchCountryField,
//     CountryISO,
//     PhoneNumberFormat,
// } from "ngx-intl-tel-input";

// import { IMember, MemberDto } from "../../../dto/Member.dto";
// import { MemberService } from "../../../services/Member.service";

// // @ts-ignore
// @Component({
//     selector: "app-create-task",
//     templateUrl: "./create-update-member.html",
// })
// export class CreateUpdateMember implements OnInit, OnDestroy {
//     member: MemberDto = {};

//     submitted: boolean = false;
//     memberForm!: FormGroup;
//     isLoadingClient: boolean = false;
//     isLoading: boolean = false;

//     isDarkMode = true;
//     separateDialCode = false;
//     SearchCountryField = SearchCountryField;
//     CountryISO = CountryISO;
//     PhoneNumberFormat = PhoneNumberFormat;
//     preferredCountries: CountryISO[] = [
//         CountryISO.UnitedStates,
//         CountryISO.SriLanka,
//     ];

//     private subscription: Subscription = new Subscription();

//     constructor(
//         private memberService: MemberService,
//         private messageService: MessageService,
//         public config: DynamicDialogConfig,
//         public ref: DynamicDialogRef,
//         private fb: FormBuilder
//     ) {}

//     ngOnInit(): void {
//         //set default data

//         //Form Control with Validation
//         this.memberForm = this.fb.group({
//             MemberId: [""],
//             Name: [""],
//             Age: [null],
//             Email: [""],
//             PhoneNumber: [""],
//             Address: [""],
//             Gender: [""],
//             IsActive: [null],
//             TenderTeamId: [""],
//         });

//         //edit member if requested by the row click
//         if (this.config.data != null) {
//             this.editMember(this.config.data);
//         }
//     }

//     save() {
//         this.submitted = true;

//         if (this.memberForm.invalid) {
//             return;
//         }

//         const PhoneNumber = this.memberForm.get("PhoneNumber")?.value;
//         const e164Number = PhoneNumber?.e164Number;

//         this.memberForm.patchValue({
//             PhoneNumber: e164Number,
//         });

//         this.isLoading = true;

//         const member = this.memberForm.value;

//         if (member.MemberId) {
//             this.subscription.add(
//                 this.memberService
//                     .updateMember(member)
//                     .pipe(
//                         finalize(() => {
//                             this.isLoading = false;
//                         })
//                     )
//                     .subscribe(
//                         (res) => {
//                             if (res.body) {
//                                 this.messageService.add({
//                                     severity: "success",
//                                     summary: "Successful",
//                                     detail: `Member Updated Successfully.`,
//                                     life: 3000,
//                                 });
//                             }
//                             this.CloseInstances();
//                         },
//                         (error) => {
//                             this.messageService.add({
//                                 severity: "error",
//                                 summary: "Failed",
//                                 detail: `Failed To Update Member.`,
//                                 life: 3000,
//                             });
//                         }
//                     )
//             );
//         } else {
//             this.subscription.add(
//                 this.memberService
//                     .createMember(member)
//                     .pipe(
//                         finalize(() => {
//                             this.isLoading = false;
//                         })
//                     )
//                     .subscribe(
//                         (res) => {
//                             if (res.body) {
//                                 this.messageService.add({
//                                     severity: "success",
//                                     summary: "Successful",
//                                     detail: `Member Created Successfully.`,
//                                     life: 3000,
//                                 });
//                             }
//                             this.CloseInstances();
//                         },
//                         (error) => {
//                             this.messageService.add({
//                                 severity: "error",
//                                 summary: "Failed",
//                                 detail: `Failed To Create Member.`,
//                                 life: 3000,
//                             });
//                         }
//                     )
//             );
//         }
//     }

//     //close dialog instances
//     CloseInstances(event?: Event) {
//         event?.preventDefault();
//         this.ref.close(this.memberForm.value);
//         this.memberForm.reset();
//         this.submitted = false;
//         this.member = {};
//     }

//     //unsubscribe all the services
//     ngOnDestroy() {
//         this.subscription.unsubscribe();
//     }

//     //edit member
//     editMember(member: MemberDto) {
//         this.member = { ...member };
//         this.memberForm.patchValue({ ...member });
//     }

//     //format date
//     formatDate(date: string | number | Date) {
//         let newdate = new Date(date);
//         let month = ("0" + (newdate.getMonth() + 1)).slice(-2);
//         let day = ("0" + newdate.getDate()).slice(-2);

//         if (date) {
//             return newdate.getFullYear() + "-" + month + "-" + day;
//         } else {
//             return "-";
//         }
//     }
// }

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { NgxPhotoEditorService } from "ngx-photo-editor";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IMember, MemberDto } from "../../../dto/Member.dto";
import { MemberService } from "../../../services/Member.service";

import {
    SearchCountryField,
    CountryISO,
    PhoneNumberFormat,
} from "ngx-intl-tel-input";


// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-member.html",
})
export class CreateUpdateMember implements OnInit, OnDestroy {
    
    Member: MemberDto = {};

    DOB: any;

    isDarkMode = true;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [
        CountryISO.UnitedStates,
        CountryISO.SriLanka,
    ];


    MemberForm!: FormGroup;
    isEdit: number = -1;
    isLoading: boolean = false;
    submitted: boolean = false;
    propicPreviewUrl: string = "";
    coverpicPreviewUrl: string = "";
    isImageUploading: boolean = false;
    croppedProfileImage: any = "";
    croppedCoverImage: any = "";
    propicChangedEvent: any = "";
    coverChangedEvent: any = "";
    visible: any;

    private subscription: Subscription = new Subscription();

    constructor(
        private MemberService: MemberService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private photoService: NgxPhotoEditorService,
        private cdr: ChangeDetectorRef,
        private http: HttpClient,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        //set default data

        //Form Control with Validation
        this.MemberForm = this.fb.group({
            MemberId: [""],
            FirstName: [""],
            LastName: [""],
            Email: [""],
            ProfileImage: [""],
            CoverImage: [""],
            Country: [""],
            Address: [""],
            DOB: [""],
            Branch: ["", Validators.required],
            ContactNo: ["", Validators.required],
        });

        //edit Member if requested by the row click
        if (this.config.data != null) {
            this.editMember(this.config.data);
            this.isEdit = 0;
this.propicPreviewUrl = (this.Member.ProfileImage && this.Member.ProfileImage.length > 0) ? this.Member.ProfileImage[0] : "";
this.coverpicPreviewUrl = (this.Member.CoverImage && this.Member.CoverImage.length > 0) ? this.Member.CoverImage[0] : "";


            this.DOB = this.Member.DOB;
        }
        if (this.config.data == null) {
            this.isEdit = -1;
        }
    }

    OnEdit() {
        this.isEdit = 1;
    }

    PropicChangeEvent(event: any): void {
        // Check if the user canceled the file open
        if (event.target.files.length > 0) {
            this.photoService
                .open(event, {
                    aspectRatio: 4 / 4,
                    autoCropArea: 1,
                    roundCropper: true,
                    modalTitle: "Crop Profile Photo",
                })
                .subscribe((data) => {
                    this.croppedProfileImage = data.file;
                    this.saveCroppedImage("profile");
                });
        } else {
            console.log("Not found");
        }
    }

    CoverPicChangeEvent(event: any): void {
        // Check if the user canceled the file open
        if (event.target.files.length > 0) {
            this.photoService
                .open(event, {
                    aspectRatio: 18 / 5,
                    autoCropArea: 1,
                    roundCropper: true,
                    modalTitle: "Crop Profile Photo",
                })
                .subscribe((data) => {
                    this.croppedCoverImage = data.file;
                    this.saveCroppedImage("cover");
                });
        } else {
            console.log("Not found");
        }
    }

    saveCroppedImage(type: string) {
        if (type === "profile") {
            this.isImageUploading = true;
            const formData = new FormData();
            formData.append("file", this.croppedProfileImage);

            this.http
                .post<any>(
                    "https://filedrop.cgaas.ai/FileMangerService/api/UploadToLocal",
                    formData
                )
                .subscribe(
                    (response) => {
                        this.Member.ProfileImage = response;
                        this.MemberForm.patchValue({
                            ProfileImage: response,
                        });
                    },
                    (error) => {
                        console.error("Error uploading image:", error);
                    }
                );

            let reader = new FileReader();
            reader.readAsDataURL(this.croppedProfileImage);
            reader.onload = (event: any) => {
                this.propicPreviewUrl = event.target.result;
                this.cdr.detectChanges();
            };
        }
        if (type === "cover") {
            this.isImageUploading = true;
            const formData = new FormData();
            formData.append("file", this.croppedCoverImage);

            this.http
                .post<any>(
                    "https://filedrop.cgaas.ai/FileMangerService/api/UploadToLocal",
                    formData
                )
                .subscribe(
                    (response) => {
                        this.Member.CoverImage = response;
                        this.MemberForm.patchValue({
                            CoverImage: response,
                        });
                    },
                    (error) => {
                        console.error("Error uploading image:", error);
                    }
                );

            let reader = new FileReader();
            reader.readAsDataURL(this.croppedCoverImage);
            reader.onload = (event: any) => {
                this.coverpicPreviewUrl = event.target.result;
                this.cdr.detectChanges();
            };
        }
    }

    fileUpload(event: any, name: string) {
        const file: File = event.target.files[0];
        const formData: FormData = new FormData();
        formData.append("file", file);

        this.MemberService.fileUpload(formData).subscribe(
            (response: any) => {
                switch (name) {
                    case "ProfileImage":
                        this.Member.ProfileImage = response;
                        break;

                    case "CoverImage":
                        this.Member.CoverImage = response;
                        break;

                    default:
                        break;
                }

                this.messageService.add({
                    severity: "success",
                    summary: "Upload Successful",
                    detail: `File "${file.name}" successfully uploaded.`,
                    life: 3000,
                });
            },
            (error) => {
                // Handle error
                this.messageService.add({
                    severity: "error",
                    summary: "Upload Failed",
                    detail: `Failed to upload file "${file.name}".`,
                    life: 3000,
                });
            }
        );
    }

    save() {
        this.submitted = true;

        if (this.MemberForm.invalid) {
            return;
        }

        const Phone = this.MemberForm.get("Phone")?.value;
        const phoneNumberE164 = Phone?.e164Number; 

        this.MemberForm.patchValue({
            Phone: phoneNumberE164,
        });

        const ContactNo = this.MemberForm.get("ContactNo")?.value;
        const e164Number = ContactNo?.e164Number;

        this.MemberForm.patchValue({
            ContactNo: e164Number,
        });

        this.isLoading = true;

        const Member = this.MemberForm.value;

        if (Member.MemberId) {
            this.subscription.add(
                this.MemberService
                    .updateMember(Member)
                    .pipe(
                        finalize(() => {
                            this.isLoading = false;
                        })
                    )
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `Member Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update Member.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            this.subscription.add(
                this.MemberService
                    .createMember(Member)
                    .pipe(
                        finalize(() => {
                            this.isLoading = false;
                        })
                    )
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `Member Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create Member.`,
                                life: 3000,
                            });
                        }
                    )
            );
        }
    }

    //close dialog instances
    CloseInstances(event?: Event) {
        event?.preventDefault();
        this.ref.close(this.MemberForm.value);
        this.MemberForm.reset();
        this.submitted = false;
        this.Member = {};
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit Member
    editMember(Member: MemberDto) {
        this.Member = { ...Member };
        this.MemberForm.patchValue({ ...Member });

        this.MemberForm.patchValue({
            DOB: Member.DOB
                ? new Date(Member.DOB).toLocaleDateString("en-US")
                : "",
        });
    }
}

import { Injectable } from "@angular/core";
import * as moment from 'moment';
import { getCookie } from "./cookie-utils";

@Injectable({ providedIn: 'root' })
export class Utils {
    constructor() { }

    public static autoLoggingLoading: boolean = false;

    /** Gender list */
    public static genders() { return ['Male', 'Female', 'Other']; }

    /**
     * @param string
     * Age validation with 2 decimal point
    */
    public static validAge(age: string) {
        let res = new ActionResult();
        var reg = /^\d+$/;
        if (age === '') {
            res.success = false;
            res.message = "Please enter age";
        }
        else if (!reg.test(age)) {
            res.success = false;
            res.message = "Please enter numeric age.";
        }
        else if (!regExp2Decimal.test(age)) {
            res.success = false;
            res.message = 'Please enter valid age. ex: 25 or 25.5';
        }
        else if (age.search('.') != -1) {
            let decimalval = age.split('.');
            let doubleVal = parseFloat(decimalval[1]);
            if (doubleVal > 12) {
                res.success = false;
                res.message = "Please enter age decimal value within 1-12";
            } else if (doubleVal === 12) {
                res.success = true;
                res.data = parseFloat(decimalval[0]) + 1;
            } else if (doubleVal == 0) {
                res.success = true;
                res.data = parseFloat(decimalval[0]).toString();
            } else {
                res.success = true;
                res.data = age;
            }
        } else {
            res.success = true;
            res.data = age;
        }
        return res;
    }

    /**
     * @param string
     * Capitalize only the first letter of the string.
     */
    public static capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    /**
     * @param string
     * Capitalize all words of a string.
     */
    public static capitalizeWords(string: string) {
        return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    };

    /**
     * Capetalize First letter from all words of a string
     * @param str 
     */
    public static titleCase(str: string) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }

    /**
     * @param date - expected format DD-MM-YYYY
     ** Return Miliseconds from given date with current minutes and seconds 
     ** Ex. 125487984554
     */
    public static getDateAttr1(date): number {
        let datetime = date + " " + moment(Date.now()).format('HH:mm:ss');
        return new Date(datetime).getTime();
    }

    /**
     * Return Miliseconds from Specific Date with Starting time 
     * ex. get value 2020-09-13 return value 2020-09-13 00:00:00 in miliseconds format
     * @param date 
     */
    public static getFirstDateTime(date) {
        let now = new Date(date);
        let firstdatetime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        return new Date(firstdatetime).getTime();
    }

    /**
     * Return Miliseconds from Specific Date with last time 
     * ex. get value 2020-09-13 return value 2020-09-13 23:59:59 in miliseconds format
     * @param date 
     */
    public static getLastDateTime(date) {
        let now = new Date(date);
        let lastdatetime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0);
        return new Date(lastdatetime).getTime();
    }

    /**
     * Return new date with initial time after add duration
     * @param date - current date or last specific date 
     * @param duration 
     */
    public static getExpireyDate(date: Date, duration: number) {
        let newDate = new Date(date.setDate(date.getDate() + duration));
        return moment(newDate).format("YYYY-MM-DD 00:00:00.000");
    }

    /** 
     * Compares two Date objects and returns e number value that represents 
     * the result:
     * 0 if the two dates are equal.
     * 1 if the first date is greater than second.
     * -1 if the first date is less than second.
     * @param date1 First date object to compare.
     * @param date2 Second date object to compare - If date2 is null then it compare with current date.
     */
    public static compareDate(date1: Date, date2): number {
        // With Date object we can compare dates them using the >, <, <= or >=.
        // The ==, !=, ===, and !== operators require to use date.getTime(),
        // so we need to create a new instance of Date with 'new Date()'
        let d1 = new Date(date1);
        let d2 = new Date();
        if (date2) d2 = new Date(date2);

        // Check if the dates are equal
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;

        // Check if the first is greater than second. That means isAfter
        if (d1 > d2) return 1;

        // Check if the first is less than second
        if (d1 < d2) return -1;
    }

    public static getDrExpiredDate(userprofile: any): string {
        var date = "";
        if (userprofile.DoctorProfile) {
            var doctorProfile = userprofile['DoctorProfile'];
            date = doctorProfile.ExpiryDate
                ? doctorProfile['ExpiryDate']
                : "";
        }
        date = date == null ? "" : date;
        return date;
    }

    public static isSubscriptionDateExpired(businessType: string): boolean {
        let isExpired = true;
        let expireDateStr = "";
        // let todayDateStr = await getOperationDate();
        let expireDate: Date;
        let user = JSON.parse(getCookie("_userSession"));
        if (!user) return true;

        let userprofile = JSON.parse(localStorage.getItem(user.id)).profile;

        if (businessType == "doctor") {
            expireDateStr = this.getDrExpiredDate(userprofile);
        }

        if (expireDateStr != "") {
            expireDate = new Date(expireDateStr);
            var com = this.compareDate(expireDate, null);
            if (com <= 0) {
                isExpired = true;
            } else if (com > 0) isExpired = false;
        }
        return isExpired;
    }

    public static isExtraDateExpired(businessType: string, days): boolean {
        let isExpired = true;
        let expairDateStr = "";
        let lastPermissionDate;
        let user = JSON.parse(getCookie("_userSession"));
        if (!user) return true;

        let userprofile = JSON.parse(localStorage.getItem(user.id)).profile;

        if (businessType == "doctor") {
            expairDateStr = this.getDrExpiredDate(userprofile);
        }

        if (expairDateStr != "") {
            let expiry = new Date(expairDateStr);
            let currentdate = moment(new Date()).format("YYYY-MM-DD 00:00:00.000");
            lastPermissionDate = this.getExpireyDate(expiry, days);
            var com = this.compareDate(lastPermissionDate, currentdate);
            if (com < 0) {
                isExpired = true;
            } else if (com >= 0) isExpired = false;
        }

        return isExpired;
    }

    /**Generate Guid Id
    ** format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    */
    public static NewGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 32 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(32);
        });
    }

    /**
     * Generate Array Object from enum.
     * result ex: [{code: 'abcd_abcd', name: 'Abcd Abcd'}]
     * @param obj - Parameter must be an enum
     */
    public static ListObjFromEnum(obj: any): any[] {
        const res = Object.keys(obj).map(key => ({ code: obj[key], name: this.titleCase(key.replace(/\_/gi, ' ')) }));
        return res;
    }

    /**
     * Generate String Array from Enum Keys.
     * @param obj - Parameter must be an enum
     */
    public static EnumKeyList(obj: any): any[] {
        const res = Object.keys(obj).map(key => key);
        return res;
    }

    /**
     * Generate String Array from Enum values
     * @param obj - Parameter must be an enum
     */
    public static EnumValueList(obj: any): any[] {
        const res = Object.values(obj).map(val => val);
        return res;
    }

    // public static AddCorsWithLink(url: string) {
    //     if (url.indexOf(environment.imgUrl) == -1) {
    //         if (url.startsWith("https")) return "https://cors-anywhere.herokuapp.com/" + url;
    //         else return "http://cors-anywhere.herokuapp.com/" + url;
    //     }
    //     else return url;
    // }

    // public static AssetPath(contentUrl: string) {
    //     if (!contentUrl) return;
    //     return (contentUrl.startsWith('https') || contentUrl.startsWith('http'))
    //         ? contentUrl
    //         : environment.imgUrl + contentUrl;
    // }

    /**
     * Insert space before each Uppercase letter. 
     * @param val 
     * ex: 'UserNameText' convert to 'User Name Text'
     */
    public static InsertSpaces(val: string) {
        val = val.replace(/([a-z])([A-Z])/g, '$1 $2');
        val = val.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
        return val;
    }

    /// Generate id for Entity
    public static generateId(type) {
        let id = '';
        let dmhms = moment(Date.now()).format('DDMMHHmmss');
        id = type + dmhms;
        return id;
    }

    public static reloadComponent(router) {
        let currentUrl = router.url;
        router.routeReuseStrategy.shouldReuseRoute = () => false;
        router.onSameUrlNavigation = 'reload';
        router.navigate([currentUrl]);
    }

    /**
     * if lastkey = null or 0, it will return current datetime in milisecond.
     * \
     * if lastkey = 12 then it will return only date(day-month-year) in milisecond.
     * @param lastkey 
     * @returns miliseconds
     */
    public static getDateEpoch(lastkey): number {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth();
        let d = date.getDate();
        let h = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let ms = date.getMilliseconds();

        if (!lastkey) {
            return date.getTime();
        } else if (lastkey == 12) {
            return new Date(y, m, d, 0, 0, 0, 0).getTime();
        } else return lastkey;
    }

    public static bloodGroups() {
        return ['A(+ve)', 'A(-ve)', 'B(+ve)', 'B(-ve)', 'O(+ve)', 'O(-ve)', 'AB(+ve)', 'AB(-ve)'];
    };

    public static formatValue(val) {
        if (val == null) return "";
        var type = Object.prototype.toString.call(val);
        if (type == "[object Number]") return val.toFixed(2);
        else if (type == "[object Object]") return "";
        else if (type == "[object Array]") return "";
        else return val;
    }

    /**
     * Set value in local storage with expiry time
     * @param key string
     * @param value string
     * @param min number
     */
    public static setWithExpiry(key, value, min: number) {
        const now = new Date();
        const expiryDate = new Date(now.getTime() + (min * 60000));

        // `item` is an object which contains the original value
        // as well as the time when it's supposed to expire
        const item = {
            value: value,
            expiry: expiryDate.getTime(),
        }
        localStorage.setItem(key, JSON.stringify(item));
    }

    /**
     * Replace special characters from URL followed by
     * https://en.wikipedia.org/wiki/Percent-encoding#Percent-encoding_reserved_characters
     */
    public static replaceUrlSC(url: string) {
        var newVal = url;
        if (url.indexOf('%') != -1) newVal = newVal.replace(/[%]/g, '%25');
        if (url.indexOf('-') != -1) newVal = newVal.replace(/[-]/g, '%2D');
        if (url.indexOf('"') != -1) newVal = newVal.replace(/["]/g, '%22');
        if (url.indexOf('$') != -1) newVal = newVal.replace(/[-]/g, '%24');
        if (url.indexOf('&') != -1) newVal = newVal.replace(/[&]/g, '%26');
        if (url.indexOf("'") != -1) newVal = newVal.replace(/[']/g, '%27');
        newVal = newVal.replace(/[#,~:*?<>{}]/g, '_');
        return newVal;
    }

    public static findConsumerBalance(data: any) {
        if (data.UserId == CompanyInfo.Id) return data.UserBalance;
        else return data.WalletBalance;
    }
}
// End of Utils

export enum PayPercent {
    Vat = 10 / 100,
    InPComission = 20 / 100,
    GatewayCharge = 2.5 / 100
}

// RegExp regExpMobileno = new RegExp(
//     r"^(([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8})$",
//     caseSensitive: false,
//     multiLine: false,
// );

export const regExpMobileno = new RegExp('^(([+][8]{2}|0088)?(01)[3-9]\\d{8})$');
const regExp2Decimal = new RegExp('^[0-9]+(\.(1)?[0-9])?$');

export class ActionResult {
    success: boolean;
    data: any;
    message: any = '';

    constructor() { };

    public confirm(val1, val2) {
        var res = new ActionResult();
        res.success = val1; res.data = val2;
        return res;
    }
}

export enum CompanyInfo {
    Id = "1",
    Name = "1"
}

export enum SponsorEventTypes {
    APPOINTMENT = "APPOINTMENT",
    PRESCRIPTION = "PRESCRIPTION",
    DOCTOR_SUBSCRIPTION = "DOCTOR SUBSCRIPTION",
    POS_SUBSCRIPTION = "POS SUBSCRIPTION"
}

export const Crypto_Sec_Key = "374D619041254DE89B9BB7E42A52A5CD";

export class AddressLineModel {
    constructor() { }

    name: string = "";
    streetNo: string = "";
    streetName: string = "";
    thana: string = "";
    district: string = "";
    division: string = "";
    country: string = "";
    lat: string = "";
    lng: string = "";
    postalCode: string = "";
    toMap(addresses: any, name: string, location: any) {
        this.name = name;
        this.lat = location.lat.toString();
        this.lng = location.lng.toString();

        addresses.forEach(item => {
            let value = item.long_name;
            switch (item.types[0]) {
                case "street_number":
                    this.streetNo = value + ", ";
                    break;
                case "route":
                    this.streetName = value;
                    break;
                case "locality":
                case "sublocality_level_1":
                    this.thana = value;
                    break;
                case "administrative_area_level_3":
                    this.thana = value.split(" ")[0];
                    break;
                case "administrative_area_level_2":
                    this.district = value.split(" ")[0];
                    break;
                case "administrative_area_level_1":
                    this.division = value.split(" ")[0];
                    break;
                case "country":
                    this.country = value;
                    break;
                case "postal_code":
                    this.postalCode = value;
                    break;
            }
        });
    }
}

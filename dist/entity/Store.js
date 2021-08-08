var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
var Stores = /** @class */ (function () {
    function Stores() {
    }
    __decorate([
        PrimaryGeneratedColumn({ type: "int" }),
        __metadata("design:type", Number)
    ], Stores.prototype, "id", void 0);
    __decorate([
        Column({ type: "varchar", length: 100 }),
        __metadata("design:type", String)
    ], Stores.prototype, "name", void 0);
    __decorate([
        Column({ type: "varchar", length: 500 }),
        __metadata("design:type", String)
    ], Stores.prototype, "address", void 0);
    Stores = __decorate([
        Entity()
    ], Stores);
    return Stores;
}());
export { Stores };

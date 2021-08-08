"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupons = void 0;
const typeorm_1 = require("typeorm");
let Coupons = class Coupons {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int" }),
    __metadata("design:type", Number)
], Coupons.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "char", length: 8 }),
    __metadata("design:type", String)
], Coupons.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", String)
], Coupons.prototype, "expires_at", void 0);
__decorate([
    typeorm_1.Column({
        type: "timestamp",
        nullable: true,
    }),
    __metadata("design:type", String)
], Coupons.prototype, "assigned_at", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], Coupons.prototype, "customer_email", void 0);
Coupons = __decorate([
    typeorm_1.Entity()
], Coupons);
exports.Coupons = Coupons;

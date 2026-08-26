"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Crown,
  Wrench,
  Trash2,
  Edit3,
  Ban,
  Calendar,
  Search,
  Lock,
  User,
  Shield,
  AtSign,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUserItem } from "@/app/admin/(dashboard)/kelola-admin/kelola-admin-view";
import { toast } from "sonner";

export interface KelolaAdminMobileViewProps {
  users: AdminUserItem[];
  currentUserRole?: string;
  onOpenAdd?: () => void;
  onOpenEdit?: (adminItem: AdminUserItem) => void;
  onOpenBan?: (adminItem: AdminUserItem) => void;
  onOpenUnban?: (adminItem: AdminUserItem) => void;
  onOpenDelete?: (adminItem: AdminUserItem) => void;
}

export function KelolaAdminMobileView({
  users,
  currentUserRole = "ADMIN",
  onOpenAdd,
  onOpenEdit,
  onOpenBan,
  onOpenUnban,
  onOpenDelete,
}: KelolaAdminMobileViewProps) {
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.nama.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-3.5 pb-8">
      {/* 🔍 Search & Controls Bar */}
      <div className="space-y-2">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama / username admin..."
            className="pl-9.5 h-10 text-xs font-medium rounded-xl border-slate-200 focus:border-sky-500 bg-white shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 h-9 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs cursor-pointer"
              aria-label="Filter Hak Akses Admin"
            >
              <option value="ALL">Semua Hak Akses</option>
              <option value="SUPER_ADMIN">👑 Super Admin</option>
              <option value="ADMIN">🔧 Admin Teknis</option>
            </select>
          </div>

          {isSuperAdmin && onOpenAdd && (
            <Button
              size="sm"
              onClick={onOpenAdd}
              className="h-9 px-3.5 rounded-xl text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-2xs shrink-0 cursor-pointer"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Tambah
            </Button>
          )}
        </div>
      </div>

      {/* 📊 Mobile Summary Stats Pills */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <Crown className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-700 text-[11px]">Super Admin</span>
          </div>
          <span className="font-extrabold text-purple-700">
            {users.filter((u) => u.role === "SUPER_ADMIN").length}
          </span>
        </div>

        <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <Wrench className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-700 text-[11px]">Admin Teknis</span>
          </div>
          <span className="font-extrabold text-sky-700">
            {users.filter((u) => u.role === "ADMIN").length}
          </span>
        </div>
      </div>

      {/* 📱 Admin User Cards List */}
      {filteredUsers.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-white/80 rounded-2xl p-6 text-center shadow-2xs">
          <p className="text-xs text-slate-400 italic font-medium">
            Tidak ada akun admin yang sesuai dengan filter pencarian.
          </p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredUsers.map((adminItem) => {
            const isSuper = adminItem.role === "SUPER_ADMIN";
            const isBanned = Boolean(adminItem.is_banned);
            const dateObj = new Date(adminItem.created_at);
            const formattedDate = dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Card
                key={adminItem.id}
                className={`border rounded-2xl transition-all shadow-2xs overflow-hidden ${
                  isBanned
                    ? "bg-rose-50/30 border-rose-200"
                    : "bg-white border-slate-200/80 hover:border-sky-300"
                }`}
              >
                <CardContent className="p-3.5 space-y-3">
                  {/* Top Row: Avatar, Name & Role Badge */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                          isBanned
                            ? "bg-rose-100 text-rose-700"
                            : isSuper
                            ? "bg-purple-100 text-purple-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {adminItem.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-xs truncate">
                          {adminItem.nama}
                        </h4>
                        <span className="font-mono text-[11px] font-bold text-sky-700 block mt-0.5">
                          @{adminItem.username}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 border ${
                        isSuper
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : "bg-sky-50 text-sky-800 border-sky-200"
                      }`}
                    >
                      {isSuper ? <Crown className="h-3 w-3 text-purple-600" /> : <Wrench className="h-3 w-3 text-sky-600" />}
                      {isSuper ? "Super Admin" : "Admin Teknis"}
                    </span>
                  </div>

                  {/* Banned Notice if active */}
                  {isBanned && (
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-[11px] space-y-0.5">
                      <div className="font-bold flex items-center gap-1">
                        <Ban className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        <span>
                          {adminItem.banned_until
                            ? `Dinonaktifkan s/d ${new Date(adminItem.banned_until).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}`
                            : "Dinonaktifkan Permanen"}
                        </span>
                      </div>
                      {adminItem.banned_reason && (
                        <p className="text-[10px] text-rose-600 italic">
                          Alasan: &ldquo;{adminItem.banned_reason}&rdquo;
                        </p>
                      )}
                    </div>
                  )}

                  {/* Metadata Row: Date & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Terdaftar: {formattedDate}
                    </span>

                    {/* Actions for Super Admin */}
                    {isSuperAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        {onOpenEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onOpenEdit(adminItem)}
                            className="h-7 px-2 text-[11px] font-bold text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg cursor-pointer"
                          >
                            <Edit3 className="h-3 w-3 mr-1 text-sky-600" />
                            Edit
                          </Button>
                        )}

                        {isBanned ? (
                          onOpenUnban && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onOpenUnban(adminItem)}
                              className="h-7 px-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 rounded-lg cursor-pointer"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                              Unban
                            </Button>
                          )
                        ) : (
                          onOpenBan && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onOpenBan(adminItem)}
                              className="h-7 px-2 text-[11px] font-bold text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer"
                            >
                              <Ban className="h-3 w-3 mr-1 text-amber-600" />
                              Ban
                            </Button>
                          )
                        )}

                        {onOpenDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onOpenDelete(adminItem)}
                            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Hapus Akun"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

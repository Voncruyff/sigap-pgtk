import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Card Header & Form */}
        <Card className="border shadow-sm">
          <CardHeader className="space-y-2 text-center pb-4 border-b bg-card">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-primary">
                SIGAP
              </h1>
              <p className="text-base font-semibold text-foreground">
                Admin Panel
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sistem Informasi Gangguan dan Perbaikan
                <br />
                PT Kebon Agung &bull; Pabrik Gula Trangkil
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <LoginForm />
          </CardContent>
        </Card>

        {/* Tombol Kembali ke Halaman Utama */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
}

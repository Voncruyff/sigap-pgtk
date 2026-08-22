-- SQL Schema for SIGAP (Sistem Informasi Gangguan dan Perbaikan)
-- PT Kebon Agung - Pabrik Gula Trangkil

-- 1. Create Status Enum
DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('MENUNGGU', 'DIPROSES', 'SELESAI');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE,
    nama_pelapor TEXT NOT NULL,
    bagian TEXT NOT NULL,
    unit_kerja TEXT NOT NULL,
    nomor_hp TEXT,
    lokasi_kerusakan TEXT NOT NULL,
    peralatan TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    foto_url TEXT,
    dampak TEXT,
    status report_status NOT NULL DEFAULT 'MENUNGGU',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by ticket_number & status
CREATE INDEX IF NOT EXISTS idx_reports_ticket_number ON public.reports(ticket_number);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- 3. Create Master Equipment Table (Data Peralatan Admin)
CREATE TABLE IF NOT EXISTS public.equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Baik',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Master Categories Table (Data Kategori Admin)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create Master Locations Table (Data Lokasi Admin)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    building TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Ticket Number Auto-Generator Function (Format: SIGAP-YYYYMMDD-XXX)
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    today_str TEXT;
    seq_num INT;
    new_ticket TEXT;
BEGIN
    today_str := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    
    -- Count reports created today
    SELECT COUNT(*) + 1 INTO seq_num
    FROM public.reports
    WHERE TO_CHAR(created_at AT TIME ZONE 'Asia/Jakarta', 'YYYYMMDD') = today_str;

    -- Format 3-digit sequence number
    new_ticket := 'SIGAP-' || today_str || '-' || LPAD(seq_num::TEXT, 3, '0');

    -- Ensure uniqueness in case of race conditions
    WHILE EXISTS (SELECT 1 FROM public.reports WHERE ticket_number = new_ticket) LOOP
        seq_num := seq_num + 1;
        new_ticket := 'SIGAP-' || today_str || '-' || LPAD(seq_num::TEXT, 3, '0');
    END LOOP;

    NEW.ticket_number := new_ticket;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-set ticket_number BEFORE INSERT if not explicitly provided
DROP TRIGGER IF EXISTS trg_generate_ticket_number ON public.reports;
CREATE TRIGGER trg_generate_ticket_number
BEFORE INSERT ON public.reports
FOR EACH ROW
WHEN (NEW.ticket_number IS NULL OR NEW.ticket_number = '')
EXECUTE FUNCTION public.generate_ticket_number();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Policies for public.reports:
DROP POLICY IF EXISTS "Allow public insert to reports" ON public.reports;
CREATE POLICY "Allow public insert to reports"
ON public.reports FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select reports" ON public.reports;
CREATE POLICY "Allow public select reports"
ON public.reports FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow authenticated admin full access to reports" ON public.reports;
CREATE POLICY "Allow authenticated admin full access to reports"
ON public.reports FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for Master Data
DROP POLICY IF EXISTS "Allow public read equipment" ON public.equipment;
CREATE POLICY "Allow public read equipment" ON public.equipment FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow admin full access equipment" ON public.equipment;
CREATE POLICY "Allow admin full access equipment" ON public.equipment FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow admin full access categories" ON public.categories;
CREATE POLICY "Allow admin full access categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read locations" ON public.locations;
CREATE POLICY "Allow public read locations" ON public.locations FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow admin full access locations" ON public.locations;
CREATE POLICY "Allow admin full access locations" ON public.locations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Storage Bucket for Report Photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-photos', 'report-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Allow public upload photos" ON storage.objects;
CREATE POLICY "Allow public upload photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'report-photos');

DROP POLICY IF EXISTS "Allow public view photos" ON storage.objects;
CREATE POLICY "Allow public view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'report-photos');

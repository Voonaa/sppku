<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPPku — REST API Service</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Serif:wght@300;400;700&family=Public+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .font-serif { font-family: 'Noto Serif', Georgia, serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-public { font-family: 'Public Sans', sans-serif; }
    </style>
</head>
<body class="bg-[#fcfcfc] text-[#1c1c1c] font-sans antialiased min-h-screen flex flex-col justify-between p-12">
    <header class="max-w-xl">
        <h1 class="font-serif text-4xl font-bold text-[#094cb2] mb-1">SPPku API</h1>
        <p class="font-public text-[10px] uppercase tracking-[0.25em] text-neutral-400">RESTful Service v1.0</p>
    </header>

    <main class="max-w-2xl my-12 space-y-6">
        <h2 class="font-serif text-2xl text-neutral-800">Dokumentasi Integrasi Sistem</h2>
        <p class="text-xs text-neutral-500 leading-relaxed">
            Layanan REST API ini berjalan secara profesional menggunakan Laravel 12 murni sebagai backend. Sisi Front-End SPA terpisah menggunakan React, Vite, dan Tailwind CSS.
        </p>

        <div class="bg-white p-8 rounded-md shadow-sm border border-neutral-100/50 space-y-4">
            <h3 class="font-serif text-lg text-neutral-800">Endpoint API Aktif</h3>
            <ul class="space-y-3 font-public text-[11px] text-neutral-600">
                <li><span class="font-semibold text-[#094cb2] bg-blue-50 px-2 py-0.5 rounded-sm">POST</span> /api/login</li>
                <li><span class="font-semibold text-[#094cb2] bg-blue-50 px-2 py-0.5 rounded-sm">GET</span> /api/dashboard</li>
                <li><span class="font-semibold text-[#094cb2] bg-blue-50 px-2 py-0.5 rounded-sm">GET/POST</span> /api/siswa</li>
                <li><span class="font-semibold text-[#094cb2] bg-blue-50 px-2 py-0.5 rounded-sm">POST</span> /api/pembayaran/transaksi</li>
            </ul>
        </div>
    </main>

    <footer class="pt-6 border-t border-neutral-100 text-left">
        <p class="font-public text-[9px] uppercase tracking-widest text-neutral-400">
            SPPku Engine • Ujian Sertifikasi Software Engineering 2026
        </p>
    </footer>
</body>
</html>

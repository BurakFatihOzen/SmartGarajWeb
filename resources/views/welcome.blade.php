<!DOCTYPE html>
<html lang="tr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartGaraj — Yeni Nesil Akıllı Araç ve Filo Yönetim Platformu</title>
    <meta name="description" content="SmartGaraj ile ister tek bir bireysel araç ister yüzlerce araçlık kurumsal filo; bakım geçmişi, kaporta ekspertizi, AI sağlık analizi, yakıt, trafik cezaları ve dijital pasaportu tek platformda profesyonelce yönetin.">
    <meta name="keywords" content="smartgaraj, araç bakım takip, filo yönetim sistemi, dijital araç pasaportu, kaporta ekspertiz, filo otomasyonu, ai araç teşhisi">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    
    <style>
        /* ═══════════════════════════════════════════════════════════════
           CSS TOKENS & DUAL-THEME ENGINE (DARK & LIGHT)
        ═══════════════════════════════════════════════════════════════ */
        :root {
            --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            --font-display: 'Outfit', sans-serif;
            --font-mono: 'Space Grotesk', monospace;
            
            /* Shared Color Palette */
            --amber-500: #f59e0b;
            --amber-600: #d97706;
            --amber-400: #fbbf24;
            --orange-500: #f97316;
            --emerald-500: #10b981;
            --blue-500: #3b82f6;
            --indigo-500: #6366f1;
            --rose-500: #f43f5e;
            --transition-smooth: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── DARK THEME (DEFAULT) ── */
        html.dark {
            --bg-body: #06070a;
            --bg-navbar: rgba(6, 7, 10, 0.88);
            --bg-card: #0d1017;
            --bg-card-hover: #131722;
            --bg-card-subtle: rgba(255, 255, 255, 0.02);
            --bg-glass: rgba(13, 16, 23, 0.85);
            --border-primary: rgba(255, 255, 255, 0.08);
            --border-highlight: rgba(245, 158, 11, 0.3);
            --border-subtle: rgba(255, 255, 255, 0.04);
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --text-heading: #ffffff;
            --shadow-card: 0 16px 40px -10px rgba(0, 0, 0, 0.6);
            --shadow-glow: 0 0 35px rgba(245, 158, 11, 0.18);
            --grid-line: rgba(255, 255, 255, 0.025);
            --orb-opacity: 0.16;
            --badge-bg: rgba(245, 158, 11, 0.1);
            --badge-border: rgba(245, 158, 11, 0.22);
            --badge-text: #fbbf24;
            --theme-btn-bg: #131722;
            --theme-btn-border: rgba(255, 255, 255, 0.12);
            --theme-btn-icon: #f59e0b;
        }

        /* ── LIGHT THEME ── */
        html.light {
            --bg-body: #f8fafc;
            --bg-navbar: rgba(255, 255, 255, 0.9);
            --bg-card: #ffffff;
            --bg-card-hover: #f1f5f9;
            --bg-card-subtle: #f8fafc;
            --bg-glass: rgba(255, 255, 255, 0.9);
            --border-primary: #e2e8f0;
            --border-highlight: rgba(217, 119, 6, 0.35);
            --border-subtle: #edf2f7;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #94a3b8;
            --text-heading: #090d16;
            --shadow-card: 0 16px 36px -12px rgba(15, 23, 42, 0.08);
            --shadow-glow: 0 10px 30px rgba(217, 119, 6, 0.12);
            --grid-line: rgba(15, 23, 42, 0.035);
            --orb-opacity: 0.08;
            --badge-bg: rgba(245, 158, 11, 0.12);
            --badge-border: rgba(217, 119, 6, 0.25);
            --badge-text: #b45309;
            --theme-btn-bg: #ffffff;
            --theme-btn-border: #cbd5e1;
            --theme-btn-icon: #d97706;
        }

        /* ═══════════════════════════════════════════════════════════════
           GLOBAL RESET
        ═══════════════════════════════════════════════════════════════ */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }
        body {
            font-family: var(--font-main);
            background-color: var(--bg-body);
            color: var(--text-primary);
            overflow-x: hidden;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            transition: background-color 0.4s ease, color 0.4s ease;
        }
        a { text-decoration: none; color: inherit; }
        ul { list-style: none; }
        img { max-width: 100%; height: auto; display: block; }
        section { scroll-margin-top: 100px; }

        /* ═══════════════════════════════════════════════════════════════
           ANIMATION KEYFRAMES
        ═══════════════════════════════════════════════════════════════ */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(28px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes particleMove {
            0% { transform: translate(0, 0); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }

        .scroll-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        .scroll-reveal.delay-1 { transition-delay: 0.1s; }
        .scroll-reveal.delay-2 { transition-delay: 0.2s; }
        .scroll-reveal.delay-3 { transition-delay: 0.3s; }
        .scroll-reveal.delay-4 { transition-delay: 0.4s; }

        /* ═══════════════════════════════════════════════════════════════
           NAVBAR (FIXED WITH AMPLE CLEARANCE)
        ═══════════════════════════════════════════════════════════════ */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 14px 0;
            background: var(--bg-navbar);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border-bottom: 1px solid var(--border-primary);
            transition: var(--transition-smooth);
        }
        .navbar-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* High-End Automotive Logo */
        .brand-logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            user-select: none;
        }
        .brand-emblem {
            width: 42px;
            height: 42px;
            border-radius: 13px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
            position: relative;
            overflow: hidden;
            transition: var(--transition-smooth);
            flex-shrink: 0;
        }
        .brand-emblem::after {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 50%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transform: skewX(-20deg);
            transition: 0.6s;
        }
        .brand-logo:hover .brand-emblem::after {
            left: 200%;
        }
        .brand-logo:hover .brand-emblem {
            transform: scale(1.05) rotate(2deg);
        }
        .brand-emblem svg {
            width: 22px;
            height: 22px;
            color: #ffffff;
        }
        .brand-text-wrap {
            display: flex;
            flex-direction: column;
            line-height: 1;
        }
        .brand-name {
            font-family: var(--font-display);
            font-size: 23px;
            font-weight: 800;
            letter-spacing: -0.6px;
            color: var(--text-heading);
            display: flex;
            align-items: center;
        }
        .brand-name .accent {
            background: linear-gradient(135deg, #f59e0b, #f97316);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-left: 2px;
            font-weight: 900;
        }
        .brand-tagline {
            font-size: 9.5px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-top: 3px;
        }

        /* Nav links & actions */
        .nav-menu {
            display: flex;
            align-items: center;
            gap: 32px;
        }
        .nav-link {
            font-size: 14.5px;
            font-weight: 600;
            color: var(--text-secondary);
            transition: color 0.25s ease;
            position: relative;
            padding: 6px 0;
        }
        .nav-link:hover {
            color: var(--text-heading);
        }
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #f59e0b, #f97316);
            border-radius: 2px;
            transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link:hover::after {
            width: 100%;
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        /* Theme Toggle Button */
        .theme-toggle-btn {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: var(--theme-btn-bg);
            border: 1px solid var(--theme-btn-border);
            color: var(--theme-btn-icon);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transition-smooth);
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .theme-toggle-btn:hover {
            transform: translateY(-2px) scale(1.05);
            border-color: var(--amber-500);
        }
        .theme-toggle-btn svg {
            width: 19px;
            height: 19px;
            transition: transform 0.4s ease;
        }
        .theme-toggle-btn:hover svg {
            transform: rotate(20deg);
        }

        .btn-brand-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 22px;
            border-radius: 12px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 14.5px;
            border: none;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
            transition: var(--transition-smooth);
        }
        .btn-brand-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 28px rgba(245, 158, 11, 0.45);
        }

        /* ═══════════════════════════════════════════════════════════════
           HERO SECTION (AMPLED PADDING TO PREVENT OVERLAP)
        ═══════════════════════════════════════════════════════════════ */
        .hero-section {
            position: relative;
            padding: 180px 24px 90px; /* Ample top clearance */
            min-height: 96vh;
            display: flex;
            align-items: center;
            overflow: hidden;
        }

        /* Ambient Orbs & Grid */
        .ambient-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            pointer-events: none;
            opacity: var(--orb-opacity);
            z-index: 0;
        }
        .orb-1 {
            width: 600px; height: 600px;
            background: radial-gradient(circle, #f59e0b 0%, #ea580c 70%);
            top: -150px; left: -100px;
            animation: pulseGlow 10s ease-in-out infinite;
        }
        .orb-2 {
            width: 500px; height: 500px;
            background: radial-gradient(circle, #3b82f6 0%, #6366f1 70%);
            bottom: -100px; right: -50px;
            animation: pulseGlow 12s ease-in-out infinite reverse;
        }
        .grid-backdrop {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(var(--grid-line) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
            background-size: 64px 64px;
            mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
            -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
            pointer-events: none;
            z-index: 0;
        }
        .particles-layer {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }
        .particle-dot {
            position: absolute;
            border-radius: 50%;
            background: var(--amber-500);
            opacity: 0;
            animation: particleMove linear infinite;
        }

        .hero-container {
            max-width: 1280px;
            margin: 0 auto;
            width: 100%;
            position: relative;
            z-index: 10;
        }
        .hero-header {
            text-align: center;
            max-width: 900px;
            margin: 0 auto 56px;
        }
        .hero-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 9px 22px;
            border-radius: 9999px;
            background: var(--badge-bg);
            border: 1px solid var(--badge-border);
            font-size: 13.5px;
            font-weight: 700;
            color: var(--badge-text);
            margin-bottom: 24px;
            animation: fadeInUp 0.7s ease;
        }
        .pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--emerald-500);
            box-shadow: 0 0 10px var(--emerald-500);
            animation: pulseGlow 2s infinite;
        }
        .hero-title {
            font-family: var(--font-display);
            font-size: clamp(2.8rem, 5.5vw, 4.4rem);
            font-weight: 900;
            line-height: 1.1;
            letter-spacing: -1.8px;
            color: var(--text-heading);
            margin-bottom: 24px;
            animation: fadeInUp 0.8s ease 0.15s both;
        }
        .hero-title .gradient-span {
            background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 200% auto;
            animation: gradientFlow 6s linear infinite;
        }
        .hero-desc {
            font-size: clamp(1.05rem, 1.8vw, 1.22rem);
            color: var(--text-secondary);
            max-width: 720px;
            margin: 0 auto 36px;
            font-weight: 400;
            line-height: 1.7;
            animation: fadeInUp 0.8s ease 0.3s both;
        }
        .hero-cta-group {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            flex-wrap: wrap;
            animation: fadeInUp 0.8s ease 0.45s both;
        }
        .btn-hero-main {
            padding: 16px 36px;
            border-radius: 16px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: #ffffff;
            font-weight: 800;
            font-size: 16px;
            border: none;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: var(--transition-smooth);
        }
        .btn-hero-main:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 16px 40px rgba(245, 158, 11, 0.5);
        }
        .btn-hero-secondary {
            padding: 16px 32px;
            border-radius: 16px;
            background: var(--bg-card);
            color: var(--text-heading);
            font-weight: 700;
            font-size: 16px;
            border: 1px solid var(--border-primary);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: var(--shadow-card);
            transition: var(--transition-smooth);
        }
        .btn-hero-secondary:hover {
            background: var(--bg-card-hover);
            border-color: var(--border-highlight);
            transform: translateY(-3px);
        }

        /* ═══════════════════════════════════════════════════════════════
           DUAL HERO CAR SHOWCASE (COMPREHENSIVE SMARTGARAJ FEATURES)
        ═══════════════════════════════════════════════════════════════ */
        .showcase-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-top: 50px;
        }
        .showcase-card {
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 28px;
            padding: 28px;
            box-shadow: var(--shadow-card);
            position: relative;
            overflow: hidden;
            transition: var(--transition-smooth);
            display: flex;
            flex-direction: column;
        }
        .showcase-card:hover {
            transform: translateY(-6px);
            border-color: var(--border-highlight);
            box-shadow: 0 25px 60px -15px rgba(245, 158, 11, 0.15);
        }
        .showcase-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;
        }
        .showcase-category-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 16px;
            border-radius: 999px;
            font-size: 12.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .badge-individual {
            background: rgba(244, 63, 94, 0.12);
            color: #f43f5e;
            border: 1px solid rgba(244, 63, 94, 0.25);
        }
        .badge-fleet {
            background: rgba(59, 130, 246, 0.12);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.25);
        }

        .showcase-img-container {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            aspect-ratio: 16 / 9;
            background: #000;
            margin-bottom: 24px;
        }
        .showcase-img-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .showcase-card:hover .showcase-img-container img {
            transform: scale(1.05);
        }
        .showcase-overlay-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%);
            pointer-events: none;
        }

        /* Floating Overlays on Images */
        .floating-spec-pill {
            position: absolute;
            bottom: 14px;
            left: 14px;
            right: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(13, 16, 23, 0.88);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(255, 255, 255, 0.16);
            border-radius: 14px;
            padding: 11px 16px;
            color: #ffffff;
        }
        .spec-left {
            display: flex;
            flex-direction: column;
        }
        .spec-title {
            font-size: 13.5px;
            font-weight: 800;
            letter-spacing: -0.3px;
        }
        .spec-sub {
            font-size: 11px;
            color: #cbd5e1;
            font-weight: 500;
        }
        .spec-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11.5px;
            font-weight: 700;
            color: #10b981;
            background: rgba(16, 185, 129, 0.15);
            padding: 5px 12px;
            border-radius: 99px;
            border: 1px solid rgba(16, 185, 129, 0.3);
            white-space: nowrap;
        }

        .showcase-content h3 {
            font-family: var(--font-display);
            font-size: 23px;
            font-weight: 800;
            color: var(--text-heading);
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        .showcase-content p {
            font-size: 14.5px;
            color: var(--text-secondary);
            line-height: 1.65;
            margin-bottom: 22px;
        }
        
        /* Comprehensive 8-Feature Grid */
        .showcase-features-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: auto;
            padding-top: 18px;
            border-top: 1px solid var(--border-primary);
        }
        .feature-mini-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
            line-height: 1.4;
        }
        .feature-mini-icon {
            width: 22px;
            height: 22px;
            border-radius: 7px;
            background: var(--badge-bg);
            color: var(--amber-500);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
            flex-shrink: 0;
            margin-top: 1px;
        }

        /* ═══════════════════════════════════════════════════════════════
           FEATURES SECTION
        ═══════════════════════════════════════════════════════════════ */
        .section-wrap {
            padding: 110px 24px;
            position: relative;
        }
        .section-header {
            text-align: center;
            max-width: 760px;
            margin: 0 auto 64px;
        }
        .section-kicker {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            border-radius: 999px;
            background: var(--badge-bg);
            border: 1px solid var(--badge-border);
            font-size: 12px;
            font-weight: 800;
            color: var(--badge-text);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 16px;
        }
        .section-main-title {
            font-family: var(--font-display);
            font-size: clamp(2.2rem, 4vw, 3.2rem);
            font-weight: 900;
            letter-spacing: -1.2px;
            line-height: 1.15;
            color: var(--text-heading);
            margin-bottom: 16px;
        }
        .section-subtitle {
            font-size: 16px;
            color: var(--text-secondary);
            line-height: 1.7;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            max-width: 1280px;
            margin: 0 auto;
        }
        .feature-box {
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 24px;
            padding: 36px 30px;
            box-shadow: var(--shadow-card);
            transition: var(--transition-smooth);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .feature-box::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #f59e0b, transparent);
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .feature-box:hover {
            transform: translateY(-6px);
            border-color: var(--border-highlight);
            background: var(--bg-card-hover);
        }
        .feature-box:hover::before {
            opacity: 1;
        }
        .feature-icon-wrapper {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 22px;
            transition: transform 0.4s ease;
        }
        .feature-box:hover .feature-icon-wrapper {
            transform: scale(1.1) rotate(4deg);
        }
        .icon-amber { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
        .icon-blue { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
        .icon-emerald { background: rgba(16, 185, 129, 0.12); color: #10b981; }
        .icon-purple { background: rgba(168, 85, 247, 0.12); color: #a855f7; }
        .icon-rose { background: rgba(244, 63, 94, 0.12); color: #f43f5e; }
        .icon-cyan { background: rgba(6, 182, 212, 0.12); color: #06b6d4; }

        .feature-box h3 {
            font-family: var(--font-display);
            font-size: 20px;
            font-weight: 800;
            color: var(--text-heading);
            margin-bottom: 12px;
            letter-spacing: -0.4px;
        }
        .feature-box p {
            font-size: 14.5px;
            color: var(--text-secondary);
            line-height: 1.65;
        }

        /* ═══════════════════════════════════════════════════════════════
           STATS COUNTER SECTION
        ═══════════════════════════════════════════════════════════════ */
        .stats-strip {
            background: var(--bg-card-subtle);
            border-top: 1px solid var(--border-primary);
            border-bottom: 1px solid var(--border-primary);
            padding: 60px 24px;
        }
        .stats-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
            text-align: center;
        }
        .stat-card {
            padding: 20px 10px;
        }
        .stat-value {
            font-family: var(--font-mono);
            font-size: clamp(2.5rem, 4.5vw, 3.8rem);
            font-weight: 800;
            letter-spacing: -2px;
            color: var(--amber-500);
            line-height: 1;
            margin-bottom: 10px;
        }
        .stat-name {
            font-size: 14.5px;
            font-weight: 700;
            color: var(--text-secondary);
        }

        /* ═══════════════════════════════════════════════════════════════
           WHY CHOOSE US (3 PILLARS)
        ═══════════════════════════════════════════════════════════════ */
        .pillars-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 28px;
            max-width: 1280px;
            margin: 0 auto;
        }
        .pillar-card {
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 26px;
            padding: 42px 32px;
            box-shadow: var(--shadow-card);
            text-align: center;
            transition: var(--transition-smooth);
        }
        .pillar-card:hover {
            transform: translateY(-6px);
            border-color: var(--border-highlight);
        }
        .pillar-icon-box {
            width: 72px;
            height: 72px;
            border-radius: 22px;
            background: var(--badge-bg);
            color: var(--amber-500);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            border: 1px solid var(--badge-border);
            font-size: 28px;
        }
        .pillar-card h3 {
            font-family: var(--font-display);
            font-size: 21px;
            font-weight: 800;
            color: var(--text-heading);
            margin-bottom: 12px;
        }
        .pillar-card p {
            font-size: 14.5px;
            color: var(--text-secondary);
            line-height: 1.7;
        }

        /* ═══════════════════════════════════════════════════════════════
           CTA BANNER
        ═══════════════════════════════════════════════════════════════ */
        .cta-outer {
            padding: 80px 24px 100px;
        }
        .cta-card {
            max-width: 1100px;
            margin: 0 auto;
            padding: 64px 48px;
            border-radius: 36px;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(234, 88, 12, 0.06) 100%);
            border: 1px solid var(--border-highlight);
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-card);
        }
        .cta-card h2 {
            font-family: var(--font-display);
            font-size: clamp(2rem, 3.8vw, 3.2rem);
            font-weight: 900;
            color: var(--text-heading);
            letter-spacing: -1.2px;
            margin-bottom: 18px;
        }
        .cta-card p {
            font-size: 16.5px;
            color: var(--text-secondary);
            max-width: 620px;
            margin: 0 auto 36px;
            line-height: 1.7;
        }

        /* ═══════════════════════════════════════════════════════════════
           FOOTER
        ═══════════════════════════════════════════════════════════════ */
        .footer-main {
            background: var(--bg-card);
            border-top: 1px solid var(--border-primary);
            padding: 80px 24px 36px;
        }
        .footer-inner {
            max-width: 1280px;
            margin: 0 auto;
        }
        .footer-grid {
            display: grid;
            grid-template-columns: 2.2fr 1fr 1fr 1.5fr;
            gap: 48px;
            margin-bottom: 56px;
        }
        .footer-brand-col p {
            font-size: 14.5px;
            color: var(--text-secondary);
            line-height: 1.7;
            max-width: 360px;
            margin-top: 16px;
        }
        .footer-nav-col h4 {
            font-size: 13px;
            font-weight: 800;
            color: var(--text-heading);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 20px;
        }
        .footer-nav-col ul li {
            margin-bottom: 12px;
        }
        .footer-nav-col ul li a {
            font-size: 14px;
            color: var(--text-secondary);
            transition: color 0.25s ease;
        }
        .footer-nav-col ul li a:hover {
            color: var(--amber-500);
        }

        .contact-entry {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
            font-size: 14px;
            color: var(--text-secondary);
        }
        .contact-icon-bubble {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            background: var(--badge-bg);
            color: var(--amber-500);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .footer-bottom-bar {
            padding-top: 30px;
            border-top: 1px solid var(--border-primary);
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13.5px;
            color: var(--text-muted);
        }
        .footer-social-links {
            display: flex;
            gap: 12px;
        }
        .social-btn {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: var(--bg-body);
            border: 1px solid var(--border-primary);
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition-smooth);
        }
        .social-btn:hover {
            background: var(--badge-bg);
            color: var(--amber-500);
            border-color: var(--border-highlight);
            transform: translateY(-2px);
        }

        /* ═══════════════════════════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ═══════════════════════════════════════════════════════════════ */
        @media (max-width: 1024px) {
            .showcase-grid { grid-template-columns: 1fr; }
            .features-grid { grid-template-columns: repeat(2, 1fr); }
            .pillars-grid { grid-template-columns: 1fr; }
            .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
            .stats-container { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media (max-width: 768px) {
            .nav-menu { display: none; }
            .hero-section { padding-top: 130px; }
            .showcase-features-list { grid-template-columns: 1fr; }
            .features-grid { grid-template-columns: 1fr; }
            .footer-grid { grid-template-columns: 1fr; }
            .footer-bottom-bar { flex-direction: column; gap: 18px; text-align: center; }
            .cta-card { padding: 40px 24px; }
        }
    </style>
</head>
<body>

    <!-- ═══════════════════════════ NAVBAR ═══════════════════════════ -->
    <nav class="navbar" id="mainNavbar">
        <div class="navbar-container">
            <!-- Brand Logo -->
            <a href="/" class="brand-logo">
                <div class="brand-emblem">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11.1 2 11.5V16c0 .6.4 1 1 1h2"/>
                        <circle cx="7" cy="17" r="2"/>
                        <path d="M9 17h6"/>
                        <circle cx="17" cy="17" r="2"/>
                    </svg>
                </div>
                <div class="brand-text-wrap">
                    <div class="brand-name">Smart<span class="accent">Garaj</span></div>
                    <div class="brand-tagline">Automotive Intelligence</div>
                </div>
            </a>

            <!-- Navigation Links -->
            <div class="nav-menu">
                <a href="#showcase" class="nav-link">Bireysel & Filo</a>
                <a href="#features" class="nav-link">Özellikler</a>
                <a href="#why" class="nav-link">Neden Biz?</a>
                <a href="#contact" class="nav-link">İletişim</a>
            </div>

            <!-- Navbar Actions -->
            <div class="nav-actions">
                <!-- Dark/Light Mode Switcher -->
                <button class="theme-toggle-btn" id="themeToggleBtn" aria-label="Tema Değiştir" title="Koyu / Açık Mod Değiştir">
                    <!-- Sun Icon (for Dark mode to switch to light) -->
                    <svg id="sunIcon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <!-- Moon Icon (for Light mode to switch to dark) -->
                    <svg id="moonIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>

                <!-- Login Button -->
                <a href="/login" class="btn-brand-primary">
                    <span>Giriş Yap</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        </div>
    </nav>

    <!-- ═══════════════════════════ HERO SECTION ═══════════════════════════ -->
    <section class="hero-section">
        <!-- Ambient lighting & dynamic particles -->
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>
        <div class="grid-backdrop"></div>
        <div class="particles-layer" id="heroParticles"></div>

        <div class="hero-container">
            <div class="hero-header">
                <div class="hero-badge-pill">
                    <span class="pulse-dot"></span>
                    <span>Yeni Nesil Araç ve Filo Yönetim Teknolojisi</span>
                </div>

                <h1 class="hero-title">
                    Aracınızın ve Filonuzun<br>
                    <span class="gradient-span">Dijital Zekası</span>
                </h1>

                <p class="hero-desc">
                    Bireysel aracınız için doğrulanabilir dijital servis pasaportu ve yapay zeka sağlık analizi; kurumsal filonuz için tam kapsamlı sürücü zimmet, ceza, kaza ve operasyon otomasyonu.
                </p>

                <div class="hero-cta-group">
                    <a href="/login" class="btn-hero-main">
                        <span>Hemen Ücretsiz Başla</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                    <a href="#showcase" class="btn-hero-secondary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        <span>Tüm Özellikleri İncele</span>
                    </a>
                </div>
            </div>

            <!-- ═══════════════ DUAL CAR SHOWCASE (COMPREHENSIVE FEATURES) ═══════════════ -->
            <div class="showcase-grid scroll-reveal" id="showcase">
                
                <!-- BİREYSEL GARAJIM CARD -->
                <div class="showcase-card">
                    <div class="showcase-header">
                        <span class="showcase-category-badge badge-individual">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Bireysel Garajım
                        </span>
                        <span style="font-size: 12px; font-weight: 700; color: var(--text-muted);">Kişisel & Aile Araçları İçin</span>
                    </div>

                    <div class="showcase-img-container">
                        <img src="/images/individual-car.jpg" alt="SmartGaraj Bireysel Araç Yönetimi ve Dijital Pasaport" loading="lazy">
                        <div class="showcase-overlay-gradient"></div>
                        <div class="floating-spec-pill">
                            <div class="spec-left">
                                <span class="spec-title">SmartGaraj Dijital Pasaport & AI Teşhis</span>
                                <span class="spec-sub">Aracınızın Değerini Koruyan Dijital Hafıza</span>
                            </div>
                            <div class="spec-status">
                                <span>● %100 Doğrulanabilir QR</span>
                            </div>
                        </div>
                    </div>

                    <div class="showcase-content">
                        <h3>Kişisel Araç Pasaportu, Ekspertiz ve AI Bakım</h3>
                        <p>Aracınızın tüm servis geçmişini, parça değişimlerini, kaporta durumunu ve muayene tarihlerini tek platformda yönetin. Aracınızı satarken QR kodlu resmi pasaportla şeffaf ve güvenilir şekilde sunun.</p>
                        
                        <!-- 8 DETAILED FEATURES -->
                        <div class="showcase-features-list">
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">QR Kodlu Pasaport</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Kamerayla anında sorgulanabilir mühürlü servis kaydı</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Akıllı AI Sağlık Teşhisi</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">KM ve yakıt türüne göre olası arıza & bakım uyarıları</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Kaporta Ekspertiz Şeması</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Boya, değişen ve lokal boyalı parçaları haritada görün</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Detaylı Servis & Parça Kaydı</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Tarih, KM, işçilik, parça adı ve servis maliyeti takibi</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Muayene & Sigorta Alarmları</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">TÜVTÜRK muayenesi, kasko ve MTV son ödeme bildirimleri</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Yakıt & Harcama Analizi</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">KM başı yakıt sarfiyatı ve aylık masraf grafikleri</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Tek Tıkla PDF Araç Karnesi</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Tüm ekspertiz ve bakım dökümünü resmi PDF olarak indirin</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Çoklu Araç & Garaj Desteği</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Ailenizdeki tüm araçları tek hesaptan ayrı ayrı yönetin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- KURUMSAL FİLO YÖNETİMİ CARD -->
                <div class="showcase-card">
                    <div class="showcase-header">
                        <span class="showcase-category-badge badge-fleet">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            Kurumsal Filo Yönetimi
                        </span>
                        <span style="font-size: 12px; font-weight: 700; color: var(--text-muted);">10 - 1.000+ Şirket Araçları İçin</span>
                    </div>

                    <div class="showcase-img-container">
                        <img src="/images/fleet-cars.jpg" alt="SmartGaraj Kurumsal Filo Yönetimi ve Operasyon Otomasyonu" loading="lazy">
                        <div class="showcase-overlay-gradient"></div>
                        <div class="floating-spec-pill">
                            <div class="spec-left">
                                <span class="spec-title">Merkezi Filo & Zimmet Kontrol Merkezi</span>
                                <span class="spec-sub">Operasyonel Maliyetleri & Riskleri Sıfırlayın</span>
                            </div>
                            <div class="spec-status" style="color: #3b82f6; background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.3);">
                                <span>● Canlı Operasyon Takibi</span>
                            </div>
                        </div>
                    </div>

                    <div class="showcase-content">
                        <h3>Merkezi Filo, Sürücü Zimmet ve Masraf Otomasyonu</h3>
                        <p>Şirketinizin tüm operasyonel, lojistik ve makam araçlarını tek bir kurumsal merkezden yönetin. Sürücü zimmetlerini, trafik cezalarını, departman bütçelerini ve kaza tutanaklarını tam otomasyona bağlayın.</p>
                        
                        <!-- 8 DETAILED FEATURES -->
                        <div class="showcase-features-list">
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Sürücü Zimmet & Sicil</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Personel zimmetleme, ehliyet süresi ve ceza puanı takibi</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Ceza & HGS/OGS Otomasyonu</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Gelen cezaları tarih-saate göre sorumlu sürücüye otomatik rücu</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Departman Masraf Dağılımı</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Şube ve departman bazlı yakıt, bakım ve bütçe analizleri</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Toplu Filo Bakım Takvimi</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Tüm filonun periyodik servis günlerini tek takvimde planlayın</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Kaza & Hasar Tutanak Arşivi</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Kaza tutanakları, kasko dosya numaraları ve kusur oranları</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Filo Risk & Sağlık Analizi</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Aşırı yıpranan veya anomalik KM yapan araçları hemen tespit edin</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Kurumsal PDF Filo Raporları</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">Yönetim ve muhasebe için kapsamlı filo dökümünü tek tıkla alın</span>
                                </div>
                            </div>
                            <div class="feature-mini-item">
                                <div class="feature-mini-icon">✓</div>
                                <div>
                                    <strong style="color: var(--text-heading); display: block;">Sınırsız Filo Ölçeklenebilirliği</strong>
                                    <span style="font-size: 11.5px; color: var(--text-secondary); font-weight: 400;">10 araçtan 1.000+ araca kadar çok şubeli şirketlere hazır altyapı</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- ═══════════════════════════ FEATURES SECTION ═══════════════════════════ -->
    <section class="section-wrap" id="features">
        <div class="section-header scroll-reveal">
            <div class="section-kicker">✦ Platform Özellikleri</div>
            <h2 class="section-main-title">Eksiksiz Araç <span style="color: var(--amber-500)">Yönetim Ekosistemi</span></h2>
            <p class="section-subtitle">
                İster kişisel garajınızda tek bir spor otomobil, ister lojistik operasyonunuzda yüzlerce filo aracı; tüm ihtiyaçlarınız tek platformda.
            </p>
        </div>

        <div class="features-grid">
            <!-- 1 -->
            <div class="feature-box scroll-reveal delay-1">
                <div class="feature-icon-wrapper icon-amber">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                </div>
                <h3>Detaylı Bakım & Parça Takibi</h3>
                <p>Motor yağı, filtreler, fren balataları ve ağır bakımları KM, tarih ve işçilik maliyetiyle kaydedin. Gelecek servisleri önceden haber alın.</p>
            </div>

            <!-- 2 -->
            <div class="feature-box scroll-reveal delay-2">
                <div class="feature-icon-wrapper icon-blue">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><path d="M12 7v4"></path><path d="M10 9h4"></path></svg>
                </div>
                <h3>Akıllı AI Sağlık Analizi</h3>
                <p>Yapay zeka motoru aracınızın yakıt türü, kilometre artış hızı ve geçmiş arızalarını tarayarak olası riskleri tespit eder ve tasarruf tüyoları üretir.</p>
            </div>

            <!-- 3 -->
            <div class="feature-box scroll-reveal delay-3">
                <div class="feature-icon-wrapper icon-rose">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3>Vektörel Ekspertiz Şeması</h3>
                <p>TSE standartlarında kuşbakışı kaporta diyagramı. Değişen, boyalı ve lokal boyalı parçaları şeffaf renk kodlarıyla anında görselleştirin.</p>
            </div>

            <!-- 4 -->
            <div class="feature-box scroll-reveal delay-1">
                <div class="feature-icon-wrapper icon-emerald">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </div>
                <h3>QR Doğrulamalı Pasaport</h3>
                <p>Aracınızın servis geçmişi için güvenli bir dijital kimlik. Alıcılar akıllı telefon kamerasıyla anında resmi kayıtları sorgulayabilir.</p>
            </div>

            <!-- 5 -->
            <div class="feature-box scroll-reveal delay-2">
                <div class="feature-icon-wrapper icon-purple">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
                </div>
                <h3>Yakıt & Masraf Yönetimi</h3>
                <p>Yakıt dolum fişleri, HGS geçişleri, kasko ve sigorta harcamaları grafiksel olarak raporlanır. Kilometre başına maliyetinizi hesaplayın.</p>
            </div>

            <!-- 6 -->
            <div class="feature-box scroll-reveal delay-3">
                <div class="feature-icon-wrapper icon-cyan">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3>Filo & Zimmet Sistemi</h3>
                <p>Kurumsal filolar için sürücü ehliyet ve ceza puanı takibi, departman bazlı araç tahsisi ve kaza tutanak arşivi.</p>
            </div>
        </div>
    </section>

    <!-- ═══════════════════════════ STATS COUNTER ═══════════════════════════ -->
    <section class="stats-strip">
        <div class="stats-container">
            <div class="stat-card scroll-reveal">
                <div class="stat-value" data-counter="1200">0</div>
                <div class="stat-name">Aktif Araç & Filo</div>
            </div>
            <div class="stat-card scroll-reveal delay-1">
                <div class="stat-value" data-counter="8500">0</div>
                <div class="stat-name">Dijital Servis Kaydı</div>
            </div>
            <div class="stat-card scroll-reveal delay-2">
                <div class="stat-value" data-counter="99.9">0</div>
                <div class="stat-name">% Sistem Erişilebilirliği</div>
            </div>
            <div class="stat-card scroll-reveal delay-3">
                <div class="stat-value" data-counter="100">0</div>
                <div class="stat-name">% Veri Güvenliği</div>
            </div>
        </div>
    </section>

    <!-- ═══════════════════════════ WHY CHOOSE US ═══════════════════════════ -->
    <section class="section-wrap" id="why">
        <div class="section-header scroll-reveal">
            <div class="section-kicker">✦ Neden SmartGaraj?</div>
            <h2 class="section-main-title">Güvenilir, Hızlı ve <span style="color: var(--amber-500)">Yenilikçi</span></h2>
            <p class="section-subtitle">
                Otomotiv yönetimini karmaşık tablolardan kurtarıp modern bulut teknolojisiyle birleştirdik.
            </p>
        </div>

        <div class="pillars-grid">
            <div class="pillar-card scroll-reveal delay-1">
                <div class="pillar-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3>Şifreli & Mühürlü Altyapı</h3>
                <p>Verileriniz endüstri standardı güvenlik protokolleriyle korunur. Dijital araç karneniz kaybolmaz, manipüle edilemez.</p>
            </div>

            <div class="pillar-card scroll-reveal delay-2">
                <div class="pillar-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <h3>Saniyeler İçinde Kayıt</h3>
                <p>Mobil uyumlu akıllı arayüz sayesinde servisteyken ya da yoldayken tek dokunuşla bakım veya yakıt kaydı oluşturun.</p>
            </div>

            <div class="pillar-card scroll-reveal delay-3">
                <div class="pillar-icon-box">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <h3>Bulut Tabanlı 7/24 Erişim</h3>
                <p>Akıllı telefon, tablet ya da bilgisayarınızdan; internetin olduğu her an tüm araç filonuz kontrolünüz altında.</p>
            </div>
        </div>
    </section>

    <!-- ═══════════════════════════ CTA BANNER ═══════════════════════════ -->
    <section class="cta-outer">
        <div class="cta-card scroll-reveal">
            <h2>Garajınızı <span style="color: var(--amber-500)">Geleceğe Taşıyın</span></h2>
            <p>Bireysel aracınız veya yüzlerce araçlık şirket filonuz için hemen ücretsiz hesabınızı oluşturun, dijital yönetimin konforunu yaşayın.</p>
            <a href="/login" class="btn-hero-main" style="margin: 0 auto;">
                <span>🚀 Ücretsiz Hesap Oluştur</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
        </div>
    </section>

    <!-- ═══════════════════════════ FOOTER ═══════════════════════════ -->
    <footer class="footer-main" id="contact">
        <div class="footer-inner">
            <div class="footer-grid">
                
                <!-- Brand Info -->
                <div class="footer-brand-col">
                    <a href="/" class="brand-logo">
                        <div class="brand-emblem" style="width: 38px; height: 38px; border-radius: 12px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11.1 2 11.5V16c0 .6.4 1 1 1h2"/>
                                <circle cx="7" cy="17" r="2"/>
                                <path d="M9 17h6"/>
                                <circle cx="17" cy="17" r="2"/>
                            </svg>
                        </div>
                        <div class="brand-text-wrap">
                            <div class="brand-name" style="font-size: 20px;">Smart<span class="accent">Garaj</span></div>
                        </div>
                    </a>
                    <p>Türkiye'nin en gelişmiş akıllı araç ve filo yönetim platformu. Bakım, ekspertiz, kaza ve masrafları tek dijital çatı altında toplayın.</p>
                </div>

                <!-- Platform -->
                <div class="footer-nav-col">
                    <h4>Platform</h4>
                    <ul>
                        <li><a href="#showcase">Bireysel Garajım</a></li>
                        <li><a href="#showcase">Filo Yönetimi</a></li>
                        <li><a href="#features">AI Teşhis</a></li>
                        <li><a href="/login">Giriş Yap</a></li>
                    </ul>
                </div>

                <!-- Çözümler -->
                <div class="footer-nav-col">
                    <h4>Çözümler</h4>
                    <ul>
                        <li><a href="#features">Dijital Pasaport</a></li>
                        <li><a href="#features">Kaporta Ekspertiz</a></li>
                        <li><a href="#features">Yakıt & Ceza Takibi</a></li>
                        <li><a href="#why">Güvenlik & Mühür</a></li>
                    </ul>
                </div>

                <!-- İletişim -->
                <div class="footer-nav-col">
                    <h4>İletişim & Destek</h4>
                    <div class="contact-entry">
                        <div class="contact-icon-bubble">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                        <div>
                            <div style="font-weight: 700; color: var(--text-heading); font-size: 13px;">E-Posta</div>
                            <div>destek@smartgaraj.com</div>
                        </div>
                    </div>

                    <div class="contact-entry">
                        <div class="contact-icon-bubble">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </div>
                        <div>
                            <div style="font-weight: 700; color: var(--text-heading); font-size: 13px;">Telefon</div>
                            <div>+90 (850) 300 00 00</div>
                        </div>
                    </div>

                    <div class="contact-entry">
                        <div class="contact-icon-bubble">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <div>
                            <div style="font-weight: 700; color: var(--text-heading); font-size: 13px;">Konum</div>
                            <div>Teknopark İstanbul, Türkiye</div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Bottom Row -->
            <div class="footer-bottom-bar">
                <div>&copy; {{ date('Y') }} SmartGaraj Automotive Intelligence. Tüm hakları saklıdır.</div>
                <div class="footer-social-links">
                    <a href="#" class="social-btn" aria-label="LinkedIn" title="LinkedIn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="#" class="social-btn" aria-label="Twitter / X" title="Twitter / X">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </a>
                    <a href="#" class="social-btn" aria-label="Instagram" title="Instagram">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <!-- ═══════════════════════════ CLIENT JAVASCRIPT ═══════════════════════════ -->
    <script>
        // ─── 1. DARK / LIGHT THEME ENGINE ────────────────────────────
        const html = document.documentElement;
        const themeBtn = document.getElementById('themeToggleBtn');
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');

        // Check stored theme or default to dark
        const savedTheme = localStorage.getItem('smartgaraj_theme') || 'dark';
        applyTheme(savedTheme);

        function applyTheme(theme) {
            if (theme === 'light') {
                html.classList.remove('dark');
                html.classList.add('light');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                html.classList.remove('light');
                html.classList.add('dark');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
            localStorage.setItem('smartgaraj_theme', theme);
        }

        themeBtn.addEventListener('click', () => {
            const isDark = html.classList.contains('dark');
            applyTheme(isDark ? 'light' : 'dark');
        });

        // ─── 2. STICKY NAVBAR SCROLL EFFECT ──────────────────────────
        const navbar = document.getElementById('mainNavbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                navbar.style.padding = '10px 0';
                navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
            } else {
                navbar.style.padding = '14px 0';
                navbar.style.boxShadow = 'none';
            }
        });

        // ─── 3. SCROLL REVEAL (INTERSECTION OBSERVER) ────────────────
        const revealElements = document.querySelectorAll('.scroll-reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Trigger Stats Counter if inside
                    const counters = entry.target.querySelectorAll('.stat-value');
                    counters.forEach(counter => {
                        if (!counter.dataset.started) {
                            counter.dataset.started = 'true';
                            animateCounter(counter);
                        }
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach(el => observer.observe(el));

        // ─── 4. SMOOTH NUMERICAL COUNTER ANIMATION ───────────────────
        function animateCounter(el) {
            const target = parseFloat(el.getAttribute('data-counter'));
            const isDecimal = target % 1 !== 0;
            const duration = 2200;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 4);
                const current = target * ease;

                if (isDecimal) {
                    el.textContent = current.toFixed(1);
                } else {
                    el.textContent = Math.floor(current).toLocaleString('tr-TR') + (target >= 100 ? '+' : '');
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    if (isDecimal) {
                        el.textContent = '%' + target;
                    } else if (target === 100) {
                        el.textContent = '%' + target;
                    } else {
                        el.textContent = target.toLocaleString('tr-TR') + (target >= 100 ? '+' : '');
                    }
                }
            }
            requestAnimationFrame(update);
        }

        // ─── 5. DYNAMIC HERO PARTICLES GENERATOR ─────────────────────
        const particleContainer = document.getElementById('heroParticles');
        function spawnParticle() {
            if (!particleContainer) return;
            const p = document.createElement('div');
            p.className = 'particle-dot';
            
            const size = Math.random() * 3 + 1.5;
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const dx = (Math.random() - 0.5) * 160;
            const dy = (Math.random() - 0.5) * 160 - 80;
            const duration = Math.random() * 5 + 4;

            p.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${startX}%;
                top: ${startY}%;
                --dx: ${dx}px;
                --dy: ${dy}px;
                animation-duration: ${duration}s;
            `;

            particleContainer.appendChild(p);
            setTimeout(() => p.remove(), duration * 1000);
        }

        setInterval(spawnParticle, 350);
        for (let i = 0; i < 15; i++) {
            setTimeout(spawnParticle, i * 80);
        }

        // ─── 6. SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    </script>
</body>
</html>

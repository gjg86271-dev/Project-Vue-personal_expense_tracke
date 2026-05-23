<template>
    <footer class="footer ">
        <div class="footer-inner">
            <div class="footer-grid">

                <!-- Brand -->
                <div class="brand-col">
                    <div class="logo-row">
                        <div class="logo-icon">
                            <img src="/src/assets/img/image.png" alt="KakSen Logo" class="logo" >
                        </div>
                    </div>
                    <p class="brand-desc">
                        កម្មវិធីតាមដានការចំណាយដ៏ឆ្លាតវៃបំផុត ដែលជួយឲ្យអ្នកសន្សំបានច្រើន
                        ប្រើប្រាស់យ៉ាងមានការយល់ដឹង និងឈានទៅរកគោលដៅហិរញ្ញវត្ថុបានលឿនជាងមុន។
                    </p>
                    <div class="social-row">
                        <a class="social-btn" href="https://www.facebook.com/ant.com.kh" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                        <a class="social-btn" href="https://t.me/AntTechnologyTrainingCenter" aria-label="Telegram"><i class="bi bi-telegram"></i></a>
                        <a class="social-btn" href="https://www.youtube.com/@ANTTechnologyTrainingCenter" aria-label="Youtube"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>

                <!-- ទំព័រ -->
                <div>
                    <div class="divider-line"></div>
                    <p class="footer-col-title">ទំព័រ</p>
                    <ul class="footer-links">
                        <li><RouterLink to="homelanding">ទំព័រដើម</RouterLink></li>
                        <li><RouterLink to="about">អំពីយើង</RouterLink></li>
                        <li><RouterLink to="function">មុខងារ</RouterLink></li>
                    </ul>
                </div>

                <!-- ទំនាក់ទំនង -->
                <div>
                    <div class="divider-line"></div>
                    <p class="footer-col-title">ទំនាក់ទំនង</p>
                    <div class="contact-item">
                        <i class="bi bi-envelope-fill"></i>
                        <span>sengsidomanatt@gmail.com</span>
                    </div>
                    <div class="contact-item">
                        <i class="bi bi-telephone-fill"></i>
                        <span>+855 712 622 758</span>
                    </div>
                    <div class="contact-item">
                        <i class="bi bi-geo-alt-fill"></i>
                        <span>រាជធានីភ្នំពេញ<br>ព្រះរាជាណាចក្រកម្ពុជា</span>
                    </div>
                </div>

                <!-- ទាញយក App -->
                <div>
                    <div class="divider-line"></div>
                    <p class="footer-col-title">បើចាំអរម្មណ៏ កុំភ្លេចណាចុះឈ្មោះទាំងអស់គ្នា</p>
                    <div class="app-badges">
                         <RouterLink to="/login" class="btn app-badge rounded-5 px-4">
                            <div class="app-badge-text d-flex justify-content-center m-auto ">
                                <span class="fs-4 ">ចាប់ផ្តើមឥឡូវនេះ</span>
                            </div>
                       </RouterLink>
                    </div>
                </div>

            </div>

            <!-- Bottom bar -->
            <div class="footer-bottom">
                <p>© 2025 កាក់សេន (Kak Sen). រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
                <div class="footer-bottom-links">
                    <RouterLink to="/privacy">គោលការណ៍ឯកជនភាព</RouterLink>
                    <RouterLink to="/terms">លក្ខខណ្ឌប្រើប្រាស់</RouterLink>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.footer {
    background: linear-gradient(160deg, #5e96f5 0%, #b4c0d1 50%, #d1f3db 100%);
    padding: 60px 0 0;
    font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
    position: relative;
    overflow: hidden;
}

.footer::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(37, 99, 235, 0.08);
    filter: blur(80px);
    top: -100px;
    left: -80px;
}

.footer::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.07);
    filter: blur(80px);
    bottom: 0;
    right: -60px;
}

.footer-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.4fr;
    gap: 48px;
    padding-bottom: 48px;
    border-bottom: 0.5px solid rgba(37, 99, 235, 0.15);
}

.logo-icon img {
    width: 200px;
    height: 100%;
    object-fit: contain;
    /* background-color: white;
    border-radius: 20px;
    margin-bottom: 10px; */
}

.brand-desc {
    font-size: 18;
    color: rgba(0, 0, 0, 0.55);
    line-height: 1.8;
    margin-bottom: 20px;
    max-width: 280px;
}

.social-row {
    display: flex;
    gap: 10px;
}

.social-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(37, 99, 235, 0.08);
    border: 0.5px solid rgba(37, 99, 235, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2563eb;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
}

.social-btn:hover {
    background: rgba(37, 99, 235, 0.18);
    color: #1d4ed8;
}

.divider-line {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #2563eb, #22c55e);
    border-radius: 2px;
    margin-bottom: 16px;
}

.footer-col-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a2e;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 18px;
}

.footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;
}

.footer-links li a {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.5);
    text-decoration: none;
    transition: color 0.2s;
}

.footer-links li a:hover {
    color: #2563eb;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 12px;
}

.contact-item i {
    font-size: 18px;
    color: #2563eb;
    margin-top: 2px;
    flex-shrink: 0;
}

.contact-item span {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 1.6;
}

.app-badges {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 4px;
}

.app-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(37, 99, 235, 0.07);
    border: 0.5px solid rgba(37, 99, 235, 0.2);
    border-radius: 10px;
    padding: 8px 14px;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
}

.app-badge:hover {
    background: rgba(37, 99, 235, 0.14);
}

.app-badge i {
    font-size: 24px;
    color: #2563eb;
}

.app-badge-text {
    display: flex;
    flex-direction: column;
}

.app-badge-text small {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.4);
}

.app-badge-text span {
    font-size: 18px;
    font-weight: 500;
    color: #1a1a2e;
}

/* ===== BOTTOM BAR ===== */
.footer-bottom {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

.footer-bottom p {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.35);
}

.footer-bottom-links {
    display: flex;
    gap: 20px;
}

.footer-bottom-links a {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.35);
    text-decoration: none;
    transition: color 0.2s;
}

.footer-bottom-links a:hover {
    color: #2563eb;
}
 
@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 32px;
    }
}

@media (max-width: 480px) {
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 28px;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
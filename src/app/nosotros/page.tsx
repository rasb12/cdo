
export default function Nosotros() {
    return (
        <div className="flex-1 min-h-screen flex flex-col bg-background-dark">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCiEzFgfp6jI81RtIPZGDOAOMEljBjFobTGYBfsufk1WKFV_Lm7-vu1oz6FOErkfKEOmmTwQKhilKMNQhzTDpKNAr_wZkD-0WEKEemikjpgdbwLpMf53yt4dtBIIsrdjGFHXpf25sm2oeZYRYonRO98taT5OIU_cRSt_V5RW97u7GpzweAg-XsVd37z7FOlwhBnDjODYf2g2jxFXYmWgGN_f4qgSNKGMN0XdNg6UpR_wcD-1LnPFKwKd1fcoKr4He1K2J-5zOFfVBc")',
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full max-w-4xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/90 text-slate-900 text-xs font-bold mb-3 backdrop-blur-sm shadow-[0_0_15px_rgba(19,236,91,0.3)]">
                        SOBRE NOSOTROS
                    </span>
                    <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tight mb-2 drop-shadow-lg">
                        Pasión por el Atletismo
                    </h1>
                    <p className="text-slate-300 text-lg font-light max-w-xl">
                        Formando campeones dentro y fuera de la pista desde 2010.
                    </p>
                </div>
            </div>

            <div className="px-6 py-12 lg:px-16 lg:py-16 max-w-7xl mx-auto w-full">
                {/* Timeline Section */}
                <section className="mb-20">
                    <h2 className="text-white text-3xl font-bold mb-10 border-l-4 border-primary pl-4">
                        Nuestra Historia
                    </h2>
                    <div className="grid grid-cols-[auto_1fr] gap-x-6 relative">
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-700"></div>

                        {/* Event 1 */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-10 rounded-full bg-surface-dark border-2 border-primary flex items-center justify-center shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    flag
                                </span>
                            </div>
                        </div>
                        <div className="pb-12 pt-1">
                            <div className="bg-surface-dark p-6 rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 hover:border-primary/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-white">Fundación</h3>
                                    <span className="text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm w-fit">
                                        2010
                                    </span>
                                </div>
                                <p className="text-slate-400">
                                    Nacimos con el sueño de crear un espacio profesional para el
                                    desarrollo atlético en la región oriental.
                                </p>
                            </div>
                        </div>

                        {/* Event 2 */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-10 rounded-full bg-surface-dark border-2 border-primary flex items-center justify-center shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    emoji_events
                                </span>
                            </div>
                        </div>
                        <div className="pb-12 pt-1">
                            <div className="bg-surface-dark p-6 rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 hover:border-primary/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-white">
                                        Primer Campeonato Nacional
                                    </h3>
                                    <span className="text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm w-fit">
                                        2015
                                    </span>
                                </div>
                                <p className="text-slate-400">
                                    Nuestros atletas lograron medalla de oro en relevos 4x100,
                                    marcando un hito en nuestra historia competitiva.
                                </p>
                            </div>
                        </div>

                        {/* Event 3 */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-10 rounded-full bg-surface-dark border-2 border-primary flex items-center justify-center shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    stadium
                                </span>
                            </div>
                        </div>
                        <div className="pt-1">
                            <div className="bg-surface-dark p-6 rounded-xl border border-slate-700/50 shadow-lg shadow-black/20 hover:border-primary/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-white">
                                        Nuevas Instalaciones
                                    </h3>
                                    <span className="text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm w-fit">
                                        2023
                                    </span>
                                </div>
                                <p className="text-slate-400">
                                    Inauguración de nuestro centro de alto rendimiento con pista
                                    certificada y gimnasio especializado.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Misión y Visión */}
                <section className="mb-20 grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-surface-dark to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group border border-slate-700/50 shadow-lg">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[120px] text-white">
                                rocket_launch
                            </span>
                        </div>
                        <div className="relative z-10">
                            <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-primary text-2xl">
                                    target
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Nuestra Misión</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Formar atletas íntegros a través de la disciplina deportiva,
                                fomentando valores de perseverancia, trabajo en equipo y
                                excelencia personal para impactar positivamente en su
                                comunidad.
                            </p>
                        </div>
                    </div>
                    <div className="bg-surface-dark border border-slate-700/50 rounded-2xl p-8 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[120px] text-white">
                                visibility
                            </span>
                        </div>
                        <div className="relative z-10">
                            <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center mb-6 border border-slate-700">
                                <span className="material-symbols-outlined text-primary text-2xl">
                                    light_mode
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Nuestra Visión</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Ser la escuela de atletismo de referencia en el oriente del
                                país, reconocida por la calidad técnica de nuestros entrenadores y
                                el desarrollo humano de nuestros deportistas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Equipo */}
                <section className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-white text-3xl font-bold border-l-4 border-primary pl-4 mb-2">
                                Conoce al Equipo
                            </h2>
                            <p className="text-slate-400 pl-5">
                                Profesionales dedicados a tu máximo rendimiento.
                            </p>
                        </div>
                        <button className="text-primary font-bold hover:text-white transition-colors flex items-center gap-1 group">
                            Ver todo el staff{" "}
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                arrow_forward
                            </span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="group bg-surface-dark rounded-xl overflow-hidden shadow-lg border border-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative">
                                <img
                                    alt="Entrenador Carlos Rodríguez"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuClz372bpB6hPapDcucJdKjKNIfps1qI1FESab4ZaLn9glip-KUbH-fBcvVSP6MLdQFEsx1GN8rK1lr3akqZau1GzTrry7v8nVDYgoZiYu1zqtQFs8jYo9tZECFUcgQaO6hIdLnBRnSrdD9kEb1XDg5NRJd02ReU416sObTYeo4iJGtiIILTw8AsgWBNHViV8AxCMjUeVEeR0Rfhy6TUC2zcXB5XEU7DWNJdTVBrFilxENbrrmtyZep15nik2wz2avE-GKQlTBk4JI"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent p-4">
                                    <p className="text-primary text-xs font-bold tracking-wider uppercase">
                                        Entrenador Principal
                                    </p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-1">
                                    Carlos Rodríguez
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    Especialista en velocidad y vallas
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                                        Nivel 2 World Athletics
                                    </span>
                                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                                        Lic. Ed. Física
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-surface-dark rounded-xl overflow-hidden shadow-lg border border-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative">
                                <img
                                    alt="Entrenadora Ana Pérez"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCztf_KrEpnAtlKflwINhFwxkhyCq15KCER1zruwRwTCBOraoSGR2kLwg5KWVeqEllg7QfPiOzGKGZmty8iSls8pgmZTD0js90APINmnc92xKMMqQxWRRhT2GLAMD8A_iymvt_-ebjs8b8beytzkfvlnKHIgt3t9VxKGtxa0lsOXIDAU1mz0k1cN7ZD_OHVNY7hMK9RoNaPmZzT2DAgw6ehGts0vO7hKxNowYwaxhr7yICRaB3mvUrdZ8QiQX1Kmu5AVE2Gl3kaR7g"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent p-4">
                                    <p className="text-primary text-xs font-bold tracking-wider uppercase">
                                        Nutricionista
                                    </p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-1">Ana Pérez</h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    Nutrición deportiva y bienestar
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                                        MSc. Nutrición
                                    </span>
                                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                                        ISAK 2
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-surface-dark rounded-xl overflow-hidden shadow-lg border border-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative">
                                <img
                                    alt="Entrenador Luis Mendez"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOR0xXftWRk2d4VoVgWBN2wMJR8XLnYCrF0jSgkCKxOzeQlkZSatCVZtV2-qu73pz28MaDVtptEMq8UzkinY3X8qHko4-1yueZtcbFhtBR7EWgtMrsBjvT0pYkrRHFORDsWs1YOKf6-Vl3VQ5qQzBf08_nUQWtDwP3hTsjfkOj14irlh1ASC4Y_vSVA2e8dmVK8PdYUQw8GjVRuMOofIrhBq8KzwOuXqh3QeLF5FVgTuLTqzJoJiLndKN1Dv8jZqUUsJsEKCZNRVQ"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent p-4">
                                    <p className="text-primary text-xs font-bold tracking-wider uppercase">
                                        Prep. Físico
                                    </p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-1">
                                    Luis Méndez
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    Fuerza y acondicionamiento
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                                        Nivel 3 CrossFit
                                    </span>
                                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                                        Fisioterapia
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="rounded-2xl bg-gradient-to-br from-surface-dark to-surface-darker border border-slate-800 p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC3KPjhKFB_5RbJchnt87GMAHrxJDNnbm6OLURJKWqQYnavORNA2LpWANNDFcyS5qNCmMbQuw0wmHUDjLjLSG967-ygYMVKBovjyZV9EbzTrzpttPG6fXKbS1uW5UitmKW_igK3frloXniTn4RMG2yG4VCxQDMbPK72RC7GcQWvZy30g0qWuzIqDiHt8KURd7QwDBghWv1clF5gy0tMBZeakh1eZAxRieV90KtvahZGbeVDnaCA33ZcCplhVrSV1xU-XWxEiskwOM")',
                        }}
                    ></div>
                    <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                        <div className="size-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(10,255,95,0.4)] animate-pulse">
                            <span className="material-symbols-outlined text-black font-bold text-3xl text-center">chat</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            ¿Listo para comenzar?
                        </h2>
                        <p className="text-slate-400 text-lg mb-8">
                            Únete a la familia de Corredores de Oriente hoy mismo. Escríbenos
                            directamente y agenda tu clase de prueba.
                        </p>
                        <button className="bg-primary hover:bg-[#20bd5a] text-black font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-primary/30 transform transition hover:-translate-y-1 flex items-center gap-2">
                            <span>Chatear Ahora</span>
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="mt-auto py-8 px-6 border-t border-slate-800 text-center bg-background-dark">
                <p className="text-slate-500 text-sm">
                    © 2024 Corredores de Oriente. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
}

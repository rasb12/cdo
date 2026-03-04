
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12 pb-24 relative z-10">
        <section className="relative w-full rounded-2xl overflow-hidden min-h-[500px] md:min-h-[550px] flex items-end p-6 sm:p-8 md:p-12 pb-10 sm:pb-12 mb-12 group border border-white/10 shadow-tech">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfA-2amNQbIpRqipJxf43Nfd9vUyIpya_HyL84pYUr9Hxl2dGdA2nEiNbCOMbc-4X6_Xj4HceZ7R5WZLJHMyVo77SYAB9ZqUZ9h40biG0mxfIw8NjHv-E0JSv94jkp1n5eNrx_vdyJciwD4Xa2J_0G4jaFdYA75BFCX5HZQ1-fPP1ergvLi-QXriARp5q5phUmml_Wub4CmzyzcAWzWn_LNADQsjgl7IGaP2BJrFeyLL_GTEhvtqDh17h1VlODQ8cZ4p61KLU8ISk")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          <div className="relative z-10 flex flex-col gap-4 sm:gap-6 max-w-3xl w-full">
            <div className="flex gap-3 flex-wrap">
              <div className="bg-black/40 backdrop-blur-md border border-primary/50 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-glow">
                <span className="material-symbols-outlined text-primary text-sm drop-shadow-[0_0_5px_rgba(10,255,95,0.8)]">
                  verified
                </span>
                <span className="text-primary text-xs font-bold tracking-wide uppercase">
                  Certificado IAAF
                </span>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-accent-blue/50 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-glow-blue">
                <span className="material-symbols-outlined text-accent-blue text-sm drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">
                  workspace_premium
                </span>
                <span className="text-accent-blue text-xs font-bold tracking-wide uppercase">
                  Mejor Entrenador 2024
                </span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] sm:leading-[1.1] tracking-tighter drop-shadow-lg uppercase pb-2">
              ENTRENA
              <br />
              CON LOS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-blue drop-shadow-[0_0_10px_rgba(10,255,95,0.3)] pb-1 pr-2 inline-block">
                MEJORES
              </span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-lg">
              ¡Supera tus límites físicos y mentales! Formación deportiva de élite para atletas de alto rendimiento bajo metodología olímpica certificada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full">
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-primary-hover text-black text-base font-bold tracking-wide transition-all shadow-glow hover:shadow-[0_0_20px_rgba(10,255,95,0.6)]">
                Empieza Ahora
              </Link>
              <Link href="/nosotros/equipo" className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-8 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base font-bold tracking-wide transition-all hover:border-white/40">
                Ver Nuestro Equipo
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-6 bg-accent-blue rounded-full shadow-[0_0_10px_#00f0ff]"></span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Salón de la Fama
                </h2>
              </div>
              <p className="text-gray-400 pl-3">
                Nuestros atletas destacados y sus récords.
              </p>
            </div>
            <div className="w-full lg:w-auto min-w-0 lg:min-w-[320px] mt-4 md:mt-0">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent-blue transition-colors">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-surface-dark text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue transition-all shadow-inner"
                  placeholder="Buscar atleta por nombre..."
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <button className="whitespace-nowrap px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue text-accent-blue text-sm font-bold shadow-glow-blue">
              Todos
            </button>
            <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-dark border border-white/10 hover:border-primary hover:text-primary text-gray-400 text-sm font-medium transition-colors">
              Velocidad
            </button>
            <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-dark border border-white/10 hover:border-primary hover:text-primary text-gray-400 text-sm font-medium transition-colors">
              Fondo
            </button>
            <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-dark border border-white/10 hover:border-primary hover:text-primary text-gray-400 text-sm font-medium transition-colors">
              Saltos
            </button>
            <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-dark border border-white/10 hover:border-primary hover:text-primary text-gray-400 text-sm font-medium transition-colors">
              Lanzamientos
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          <article className="group relative bg-surface-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/5 hover:border-primary/50">
            <div className="aspect-[4/5] overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBu6--8ES0AWzhPznNXKth_Cg8qPjtjVnZuKq0rYQboohX3kkMdtJv-y95IvuqHs3FozH6Rr1nw3kEg3v0MhhYt1avotlcMRmx2SNUJhAdutITx0VnwjnXuK2REjp0MyM4wcwlga2AEd-oF7GiGN0xGRUmW4-rbwwNJxJJ9T8bYgDxDWMskqJZefm0uQ31ca4UFtfBQsKYOWzLn3En8POPBxHbe5Hmr443Qc_jt5uXblGezU4wzy6SCrCpu3v9vJDNadEH-xbLXW4s")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-black bg-primary rounded shadow-[0_0_10px_rgba(10,255,95,0.4)]">
                  Velocidad
                </span>
                <h3 className="text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  Carlos Mendoza
                </h3>
                <p className="text-gray-400 text-sm">100m Plano</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-white/5 bg-surface-dark">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Mejor Marca
                </span>
                <span className="text-lg font-mono font-bold text-white group-hover:text-primary transition-colors">
                  10.45s
                </span>
              </div>
              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-black group-hover:shadow-glow transition-all duration-300">
                <span className="material-symbols-outlined">trophy</span>
              </div>
            </div>
          </article>

          <article className="group relative bg-surface-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/5 hover:border-primary/50">
            <div className="aspect-[4/5] overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDOCH_RVszTJRL_vP-sLgOpdVgp6bR3Mg-aW3RFN8mDXXJw4y8H5AnCjaOPxn0X9hutt_3eUWUtE5ismSbTvlcNHwPdb2RW5yH8fP-3fEcjZl2JEUXALb_feWCp4kTdeIMTQUHbSt_bueC6iLYk5S__SkMXAaYm6RbB9IuZ9N9WYyi38GS0cdWfFF94R7ZoCYPbpnmZNOO4AZwFIBnHAA7y1ligBPIpBXic2cRyv3mSLoURWZ3l3AkSYuGwkO0nJF1YMj0VGIoQnA")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-black bg-primary rounded shadow-[0_0_10px_rgba(10,255,95,0.4)]">
                  Fondo
                </span>
                <h3 className="text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  Ana Torres
                </h3>
                <p className="text-gray-400 text-sm">Maratón</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-white/5 bg-surface-dark">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Mejor Marca
                </span>
                <span className="text-lg font-mono font-bold text-white group-hover:text-primary transition-colors">
                  2:45:12
                </span>
              </div>
              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-black group-hover:shadow-glow transition-all duration-300">
                <span className="material-symbols-outlined">trophy</span>
              </div>
            </div>
          </article>

          <article className="group relative bg-surface-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/5 hover:border-primary/50">
            <div className="aspect-[4/5] overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAXV6Tb_0Mc5tWOLLz7TPZATxOyfCUNd_QKnl26jsnijRYmFNEKT_JMCJWUTuod3GToewfofre1YH5h060AJp0qR3STlqTI7rrVMBLrGxvPjtZRJcOf276cmO0_UwRqgNGoyt9X5ntmzPRafv0hb0uWAcwf6T4FLaB2KNiBUHC8gMRzabqsLXrbrrqtU7_7Tdom6GU4eloM06epN1grkcP5SRZR_o0xTg0jI7vT-fG8jUhdTsHOHPiY16CijRKfTGguXIHKYyh_z9Y")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-black bg-primary rounded shadow-[0_0_10px_rgba(10,255,95,0.4)]">
                  Saltos
                </span>
                <h3 className="text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  Miguel Ángel
                </h3>
                <p className="text-gray-400 text-sm">Salto Alto</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-white/5 bg-surface-dark">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Mejor Marca
                </span>
                <span className="text-lg font-mono font-bold text-white group-hover:text-primary transition-colors">
                  2.30m
                </span>
              </div>
              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-black group-hover:shadow-glow transition-all duration-300">
                <span className="material-symbols-outlined">trophy</span>
              </div>
            </div>
          </article>

          <article className="group relative bg-surface-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/5 hover:border-primary/50">
            <div className="aspect-[4/5] overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxFYwpH7MxkPsABxrynd135OxycQR0K5lEOxb2N7ML-znAcUCILR8ztynO54blcH1PV8PBJ8iwW_fOiDZGI6e-fwUVavk4swmsZO8lIYBmjfgcoIR0u6xorwCI1SKhUdhpO6kPRmGNXEPrzI1CtM_ByG1GWuGiRIJ_JB5WMjpgjckuhiNXOym7Qv5Tr0HQLsfm0opmq1S5Hi0IP9CXEZrtKwHRiqqIz8Y-y_wa_OLH-Jdadu883a61r2on_E0PH7iP2ZdT1c5OUMo")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-black bg-primary rounded shadow-[0_0_10px_rgba(10,255,95,0.4)]">
                  Velocidad
                </span>
                <h3 className="text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  Lucía Méndez
                </h3>
                <p className="text-gray-400 text-sm">200m Plano</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-white/5 bg-surface-dark">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Mejor Marca
                </span>
                <span className="text-lg font-mono font-bold text-white group-hover:text-primary transition-colors">
                  22.89s
                </span>
              </div>
              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-black group-hover:shadow-glow transition-all duration-300">
                <span className="material-symbols-outlined">trophy</span>
              </div>
            </div>
          </article>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_#0aff5f]"></span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Vida en la Pista
            </h2>
          </div>
          <div className="w-full gap-2 overflow-hidden bg-surface-dark aspect-square md:aspect-[3/1] rounded-2xl grid grid-cols-2 md:grid-cols-4 p-2 border border-white/5">
            <div
              className="w-full bg-center bg-no-repeat bg-cover aspect-auto col-span-2 row-span-2 relative group overflow-hidden rounded-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBe4qVDhbjVdGuke4_lCfvEYltiMXiM4wYz-gkDLkeF50VGcFypbQWBjbAFpsyaW-3WK8h_8-lnkOfLHMRRxsCjS9LjtwTkcgmh1FhQRBxU-aQrSnjUQ3ZkJuGKalS2FNwMLBVuQC94JNjlh43GvJ9UOs0IBmP7dTxTl9XPFDc63RNypqPcWyxE9jGa11ptfho6POdpdIASUAoL2emglQVoeLUBytsYY_EJzHI1tPRMN8GtJw1DklIlRFx783lbbV7z118KtkkVHow")',
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500"></div>
            </div>
            <div
              className="w-full bg-center bg-no-repeat bg-cover aspect-auto relative group overflow-hidden rounded-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwcoiZl-oz2vkbHqNs_XJ_KFyrzaCF_ueoIi9sBcvrDvWswaeIXF-Ajvoqr0S9DHySNEo10zhupQ8t2vG3zik28gO38VMLhI79nWb03wV9nN-9N9vN8yMmGjWKadA0l1BgjMM1Xu_uP_ar0T9aR-bhvao9KYCLC0biCRBiPYjEf58x1EUnAw2HjCJdDtURRtsndwgfqjXg-AcaJIjqkRkxyoy7mvjxFZgCvHdIjF7X_2RZK6UvpPbUZOtijL-UXDzB1puOwea4c_o")',
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500"></div>
            </div>
            <div
              className="w-full bg-center bg-no-repeat bg-cover aspect-auto relative group overflow-hidden rounded-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6hqsa_Z0KwdBvjh7EyOQfXTbwErUobV4FsmtVbxVIE8YkTwCaHmC4FZrsjFMj1OLm8xwlAQl5tKp0yrj58KU9zhKgzOIovPca9iwlIF5mKGCCOVP82H2mlXmtRDjipLXzcxaegNdXgbV3jnTovdLUz2lW3uz9xVPhALSZBV5nuKvQCgvQ9dNrPc0mYbY3CLiN2-KO4A7tEflXcthEZ4T6LEVPcY-e2-coWPsCepQP8QM2zd6BNEghBFpIGQLgIL2-JkjnC765BAE")',
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500"></div>
            </div>
            <div
              className="w-full bg-center bg-no-repeat bg-cover aspect-auto col-span-2 relative group overflow-hidden rounded-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApEyuxESmmCphV41tkXK3wxb25tfPZt8rt7ezj3avKkX18zxEjsGiWfNQ5DusgsulTocPhEv0tZdEYsge-0DmKEymye_rdBDzN_kwNwq1jJiAjkLb3y4GTVjEkPryWZFqdfPniFULV5L6uYmM-CG9EJ8Z1S5wWEokea3InHQPyzrqKAaUaJaxPMKAOkjJjE3_ZuM1QXXifCRVhCEFRpRoDS84tOiNX5D9jrWF-hDj2ZeU5o9jnCVH_A3LCceO6_nbzMJ1NgQCij3g")',
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500"></div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-surface-darker to-surface-dark p-8 md:p-12 text-center relative overflow-hidden border border-white/5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
            <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(10,255,95,0.2)]">
              <span className="material-symbols-outlined text-primary text-5xl drop-shadow-lg">
                bolt
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Tu legado comienza aquí
            </h2>
            <p className="text-gray-400 text-lg">
              Únete a una comunidad de más de 500 atletas apasionados y lleva tu
              rendimiento al siguiente nivel. Primera clase de prueba gratis.
            </p>
            <Link href="/register" className="mt-4 flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary hover:bg-primary-hover text-black text-lg font-bold shadow-glow hover:shadow-[0_0_30px_rgba(10,255,95,0.8)] active:translate-y-[2px] active:shadow-none transition-all">
              Inscribirse Hoy
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <>
      <div className="text-neutral-400 flex justify-center">
        <div className="max-w-2xl w-full pt-4 pb-10">
          <div className="leading-relaxed space-y-6 pb-4 text-lg text-neutral-300">
            <strong>Ciro - 19y - Colombia</strong>
          </div>
          <div className="text-sm leading-relaxed space-y-6">
            <p>
              I’m a second-year <strong className='text-neutral-300'>Computer Science</strong> student at the University of Calgary, with strong interests in <strong className='text-neutral-300'>database systems</strong>,
              <strong className='text-neutral-300'> low-level programming</strong>, and <strong className='text-neutral-300'>infrastructure</strong>. I value <strong className='text-neutral-300'>simplicity</strong>, <strong className='text-neutral-300'>performance</strong>, and <strong className='text-neutral-300'>reliability</strong>.
            </p>

            <p>
              My journey into programming began through developing <a className="text-neutral-300 hover:underline" href="https://papermc.org/">PaperMC plugins</a>, which introduced me to Java and Kotlin
              and sparked my passion for coding and computer science.
            </p>

            <p>
              Since starting my degree, I’ve joined the <strong className='text-neutral-300'>DSIL Lab</strong> at the University of Calgary as a research assistant under the supervision of{" "}
              <a className="text-neutral-300 hover:underline" href="https://kaisonghuang.github.io">Dr. Kaisong Huang</a>, working on <strong className='text-neutral-300'>vector indexes</strong> and infrastructure for <strong className='text-neutral-300'>data-intensive systems</strong>.
            </p>

            <p>
              Looking ahead, I hope to keep contributing to <strong className='text-neutral-300'>computer science research</strong> and to develop my own project for an <strong className='text-neutral-300'>Honours thesis</strong>. I aspire to pursue a
              <strong className='text-neutral-300'> Ph.D.</strong>, potentially focusing on <strong className='text-neutral-300'>database systems</strong> or a related area.
            </p>

            <p>
              Outside of research, I enjoy the <strong className='text-neutral-300'>gym</strong>, <strong className='text-neutral-300'>ice skating</strong>, and spending time outdoors. I’m also an <strong className='text-neutral-300'>F1</strong> enthusiast,
              loyally (and unfortunately) rooting for <strong className='text-neutral-300'>Aston Martin</strong>.
            </p>
          </div>

          <div className="pt-10 text-sm text-neutral-300">
            &quot;Todo lo que un sueño necesita para ser realizado es que alguien crea que puede lograrse.&quot; — Gabriel García Márquez
          </div>
        </div>
      </div>
    </>
  );
}

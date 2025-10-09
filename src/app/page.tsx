export default function Home() {
  return (
    <>
      <div className="text-neutral-400 flex justify-center">

        <div>
          <div className="max-w-2xl leading-relaxed space-y-6 pb-4 pt-4 text-lg text-neutral-300">
            <strong>Ciro - 18y - Colombia</strong>
          </div>
          <div className="max-w-2xl  text-sm leading-relaxed space-y-6">
            <p>
              I’m a first-year <strong className='text-neutral-300'>Computer Science</strong> student at the University of Calgary with strong interests in <strong className='text-neutral-300'>computer networks</strong>,
              <strong className='text-neutral-300'> software architecture</strong>, and <strong className='text-neutral-300'>low-level programming</strong>. I value attention to <strong className='text-neutral-300'>detail</strong>, <strong className='text-neutral-300'>simplicity</strong>, and <strong className='text-neutral-300'>precision</strong> in
              everything I build.
            </p>

            <p>
              My journey into programming began through developing <a className="text-neutral-300 hover:underline" href="https://papermc.org/">PaperMC plugins</a>, which introduced me to Java and Kotlin
              and sparked my passion for coding. Today, I spend most of my time exploring different areas of computer science
              that challenge me and keep me curious.
            </p>

            <p>
              Looking ahead, I hope to contribute to <strong className='text-neutral-300'>computer science research</strong> as an undergraduate and eventually pursue a
              Master’s or Ph.D., potentially focusing on <strong className='text-neutral-300'>networks</strong> or <strong className='text-neutral-300'>quantum computing</strong>. The future may be uncertain, but I’m
              genuinely excited about where it might lead.
            </p>

            <p>
              Outside of coding, I’m deeply passionate about <strong className='text-neutral-300'>music</strong> and <strong className='text-neutral-300'>motorsports</strong>, and I have an unusual enthusiasm for
              studying — if I’m not diving into computer science, I’m probably yapping about something in between math and sports.
            </p>
          </div>

          <div className="pt-10 text-sm text-neutral-300">
            &quot;La vida es muy simple, pero insistimos en hacerla complicada&quot; - Confucio
          </div>
        </div>
      </div>

    </>
  );
}

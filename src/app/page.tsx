import Header from '@/components/layout/header';
import PortfolioPage from '@/components/portfolio/portfolio-page';
import { Button } from '@/components/ui/button';
import { projects as initialProjects } from '@/lib/data';
import { Github, Heart, Linkedin, Mail } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <section className="text-center mb-12">
          <h1 className="font-headline text-5xl font-bold tracking-tight">
            Luke Ponga
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Software Developer
          </p>
          <p className="mt-4 max-w-2xl mx-auto">
            A passionate developer from Hamilton, NZ, specializing in IoT and AI
            solutions. I build innovative technology to solve real-world
            problems and am always exploring the cutting edge of tech.
          </p>
        </section>

        <section id="about" className="mb-12">
          <h2 className="text-3xl font-headline font-bold mb-6 text-center">
            About Me
          </h2>
          <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-md">
            <p className="mb-4">
              I'm a passionate software developer with expertise in building
              scalable applications, IoT systems, and AI solutions. With a
              strong foundation from my diplomas and hands-on experience, I
              focus on creating efficient and innovative software.
            </p>
            <p>
              My interests center around Internet of Things (IoT) ecosystems and
              Artificial Intelligence. I have recently expanded my expertise
              through certification in Generative AI and continue to explore new
              technologies to solve complex problems.
            </p>
          </div>
        </section>

        <section id="skills" className="mb-12">
          <h2 className="text-3xl font-headline font-bold mb-6 text-center">
            My Skills
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-headline font-semibold mb-4">
                Development
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>C# & .NET Framework</li>
                <li>Java & Spring Boot</li>
                <li>Python & TensorFlow</li>
                <li>JavaScript/TypeScript</li>
                <li>Generative AI</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-headline font-semibold mb-4">
                Technical
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>IoT System Design</li>
                <li>Cloud Infrastructure (AWS)</li>
                <li>API Development</li>
                <li>Database Management</li>
                <li>Data Analysis</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-headline font-semibold mb-4">
                Soft Skills
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Problem Solving</li>
                <li>Logical Reasoning</li>
                <li>Time Management</li>
                <li>Project Organization</li>
                <li>Detail Oriented</li>
              </ul>
            </div>
          </div>
        </section>

        <PortfolioPage initialProjects={initialProjects} />

        <section id="education" className="mb-12 mt-12">
          <h2 className="text-3xl font-headline font-bold mb-6 text-center">
            Education & Certificates
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="font-headline font-semibold">
                Level 6 Diploma in Software Development
              </h3>
              <p className="text-sm text-muted-foreground">
                Vision College, Hamilton | 2020 - 2021
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="font-headline font-semibold">
                Level 5 Diploma in Web Development & Design
              </h3>
              <p className="text-sm text-muted-foreground">
                Vision College, Hamilton | 2019 - 2021
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="font-headline font-semibold">
                Level 3 Cert. in Business Admin & Technology
              </h3>
              <p className="text-sm text-muted-foreground">
                Vision College, Hamilton | 2018
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="font-headline font-semibold">
                Generative AI Certificate
              </h3>
              <p className="text-sm text-muted-foreground">
                Issued by CodeSignal
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="font-headline font-semibold">
                Microsoft Build Natural Language Certificate
              </h3>
              <p className="text-sm text-muted-foreground">
                Issued by Microsoft
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="text-center">
          <h2 className="text-3xl font-headline font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision. Feel free to reach out.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="mailto:lukeponga9@gmail.com">
                <Mail className="mr-2" /> Email
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://linkedin.com/in/lukeponga"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2" /> LinkedIn
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/lukeponga-dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2" /> GitHub
              </a>
            </Button>
          </div>
        </section>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground mt-12">
        <p>© 2025 Luke Ponga. All Rights Reserved.</p>
        <p className="flex items-center justify-center gap-1">
          Designed with <Heart className="h-4 w-4 text-primary" /> in Hamilton,
          New Zealand
        </p>
      </footer>
    </div>
  );
}

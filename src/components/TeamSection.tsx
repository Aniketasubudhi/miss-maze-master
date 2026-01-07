import { User, GraduationCap, School } from "lucide-react";

const teamMembers = [
  { name: "Student Name 1", usn: "1RV22CS001" },
  { name: "Student Name 2", usn: "1RV22CS002" },
  { name: "Student Name 3", usn: "1RV22CS003" },
  { name: "Student Name 4", usn: "1RV22CS004" },
];

const TeamSection = () => {
  return (
    <section id="team" className="py-24 px-4 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Our <span className="gradient-text">Team</span>
          </h2>
          <p className="section-subtitle mx-auto">
            The minds behind this Operating Systems project.
          </p>
        </div>

        {/* Team members */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <div
              key={member.usn}
              className="glass-card text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground font-mono text-sm">{member.usn}</p>
            </div>
          ))}
        </div>

        {/* Faculty and college info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Faculty Mentor</h3>
                <p className="text-muted-foreground text-sm">Project Guide</p>
              </div>
            </div>
            <p className="text-lg font-medium">Prof. Faculty Name</p>
            <p className="text-muted-foreground">Department of Computer Science</p>
          </div>

          <div className="glass-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-accent/20">
                <School className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Institution</h3>
                <p className="text-muted-foreground text-sm">Academic Year 2024-25</p>
              </div>
            </div>
            <p className="text-lg font-medium">RV College of Engineering</p>
            <p className="text-muted-foreground">Bengaluru, Karnataka</p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            Operating Systems Course Project • 5th Semester • Department of Computer Science & Engineering
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

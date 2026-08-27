import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.service.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.processStep.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.techStackItem.deleteMany();
  await prisma.contactSubmission.deleteMany();

  await prisma.service.createMany({
    data: [
      {
        title: "HR Systems",
        code: "S/01",
        description:
          "End-to-end human resource platforms that handle payroll, recruitment, performance tracking, and employee management with modern automation.",
        features: [
          "Automated payroll & benefits",
          "Applicant tracking pipeline",
          "Performance review cycles",
          "Employee self-service portal",
        ],
        icon: "users",
        order: 1,
      },
      {
        title: "ERP Solutions",
        code: "S/02",
        description:
          "Integrated resource planning systems that unify finance, inventory, supply chain, and operations into a single source of truth.",
        features: [
          "Real-time financial dashboards",
          "Inventory & warehouse sync",
          "Multi-entity consolidation",
          "Custom reporting engine",
        ],
        icon: "layers",
        order: 2,
      },
      {
        title: "Custom Development",
        code: "S/03",
        description:
          "Bespoke software built from scratch — APIs, internal tools, customer portals, and microservices tailored to your exact workflows.",
        features: [
          "RESTful & GraphQL APIs",
          "Microservices architecture",
          "CI/CD pipeline setup",
          "Post-launch maintenance",
        ],
        icon: "code",
        order: 3,
      },
    ],
  });

  await prisma.stat.createMany({
    data: [
      {
        value: 240,
        suffix: "+",
        label: "Projects Shipped",
        barPercent: 94,
        order: 1,
      },
      {
        value: 86,
        suffix: null,
        label: "Enterprise Clients",
        barPercent: 72,
        order: 2,
      },
      {
        value: 12,
        suffix: null,
        label: "Years Building",
        barPercent: 60,
        order: 3,
      },
      {
        value: 98,
        suffix: "%",
        label: "Client Retention",
        barPercent: 98,
        order: 4,
      },
    ],
  });

  await prisma.processStep.createMany({
    data: [
      {
        stepNumber: 1,
        title: "Survey",
        description:
          "We audit your current systems, interview stakeholders, and map every workflow before writing a single line of code.",
      },
      {
        stepNumber: 2,
        title: "Build",
        description:
          "Iterative sprints with working demos every two weeks. You see progress continuously, not just at the end.",
      },
      {
        stepNumber: 3,
        title: "Hand Over",
        description:
          "Full documentation, team training, and 90 days of post-launch support so your team never feels stranded.",
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        quote:
          "Owlex rebuilt our entire HR platform in under four months. What used to take our team two days now happens automatically overnight.",
        name: "Marta Kowalczyk",
        role: "VP of People, Lumina Health",
        order: 1,
        active: true,
      },
      {
        quote:
          "Their ERP implementation saved us from a second SAP license. We consolidated three tools into one clean system.",
        name: "Daniel Osei",
        role: "CTO, NovaChem Industries",
        order: 2,
        active: true,
      },
      {
        quote:
          "The custom portal they built handles 12,000 daily logins without a hiccup. Our previous vendor couldn't do half that.",
        name: "Helena Voss",
        role: "Director of Digital, Atlas Retail",
        order: 3,
        active: true,
      },
    ],
  });

  await prisma.techStackItem.createMany({
    data: [
      { name: "TypeScript", featured: false, order: 1 },
      { name: "React", featured: false, order: 2 },
      { name: "Python", featured: false, order: 3 },
      { name: "Go", featured: false, order: 4 },
      { name: "PostgreSQL", featured: false, order: 5 },
      { name: "Kubernetes", featured: false, order: 6 },
      { name: "AWS", featured: false, order: 7 },
      { name: "Terraform", featured: true, order: 8 },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

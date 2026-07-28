process.env.NODE_ENV = "test";

const assert = require("node:assert/strict");
const { once } = require("node:events");

const appModule = require("../server.js");
const helpers = appModule.__testables;

const cases = [
  {
    name: "createPublicReference pads values for user-facing references",
    run() {
      assert.equal(helpers.createPublicReference("JOB", 1), "JOB-OQS-000001");
      assert.equal(helpers.createPublicReference("APP", 128), "APP-OQS-000128");
    },
  },
  {
    name: "validateJobPayload accepts a complete company job payload",
    run() {
      const result = helpers.validateJobPayload(
        {
          title: "Senior QA Engineer",
          department: "Engineering",
          description: "Own manual and automation quality delivery.",
          responsibilities: "Lead test planning\nDrive automation coverage",
          requiredSkills: "Selenium, API testing, Test strategy",
          preferredSkills: "Playwright, CI/CD",
          minimumExperience: "3",
          maximumExperience: "6",
          qualification: "B.E / B.Tech",
          location: "Chennai",
          workMode: "hybrid",
          employmentType: "full-time",
          salaryMinimum: "500000",
          salaryMaximum: "900000",
          openings: "2",
          shiftDetails: "General shift",
          noticePeriodPreference: "Immediate to 30 days",
          applicationDeadline: "2026-08-15",
          screeningQuestions:
            "Have you built automation frameworks?\nHow do you handle regression planning?",
          candidateAudience: "experienced",
          industry: "SaaS",
          additionalInformation: "Client-facing quality ownership.",
          internalCompanyNote: "Prioritize fintech background.",
        },
        { requireComplete: true },
      );

      assert.equal(result.error, undefined);
      assert.equal(result.title, "Senior QA Engineer");
      assert.deepEqual(result.requiredSkills, [
        "Selenium",
        "API testing",
        "Test strategy",
      ]);
      assert.equal(result.screeningQuestions.length, 2);
      assert.equal(result.workMode, "hybrid");
      assert.equal(result.candidateAudience, "experienced");
    },
  },
  {
    name: "validateJobPayload blocks invalid job completion data",
    run() {
      const result = helpers.validateJobPayload(
        {
          title: "Trainee Recruiter",
          description: "Help with screening and sourcing.",
          location: "Bengaluru",
          workMode: "remote",
          employmentType: "full-time",
          openings: "1",
          applicationDeadline: "2026-08-01",
        },
        { requireComplete: true },
      );

      assert.equal(result.error, "Enter the department.");
    },
  },
  {
    name: "buildPublicJobViewDocument keeps candidate-safe fields only",
    run() {
      const publicJob = helpers.buildPublicJobViewDocument({
        _id: "687d00000000000000000001",
        jobReference: "JOB-OQS-000011",
        title: "Platform Engineer",
        department: "Technology",
        description: "Support backend services for growth.",
        responsibilities: ["Build APIs", "Maintain uptime"],
        requiredSkills: ["Node.js", "MongoDB"],
        preferredSkills: ["AWS"],
        minimumExperience: 2,
        maximumExperience: 5,
        qualification: "B.Tech",
        location: "Hyderabad",
        workMode: "hybrid",
        employmentType: "full-time",
        salaryMinimum: 600000,
        salaryMaximum: 1200000,
        showSalaryToCandidate: false,
        openings: 2,
        shiftDetails: "General shift",
        noticePeriodPreference: "30 days",
        applicationDeadline: new Date("2026-08-10"),
        screeningQuestions: [{ id: "SQ-1", question: "Have you worked with Node.js?" }],
        candidateAudience: "experienced",
        industry: "SaaS",
        additionalInformation: "Fast-growing engineering team.",
      });

      assert.equal(publicJob.salaryMinimum, null);
      assert.equal(publicJob.salaryMaximum, null);
      assert.equal(publicJob.jobReference, "JOB-OQS-000011");
      assert.equal("companyAccountId" in publicJob, false);
      assert.equal("companyEmail" in publicJob, false);
      assert.equal("internalCompanyNote" in publicJob, false);
    },
  },
  {
    name: "containsEmployerIdentitySignals catches contact and identity leaks",
    run() {
      assert.equal(
        helpers.containsEmployerIdentitySignals(
          "Please email careers@example.com to continue.",
          ["OneQuickSolutions"],
        ),
        true,
      );
      assert.equal(
        helpers.containsEmployerIdentitySignals(
          "This role is based in a fast-growing product team.",
          ["OneQuickSolutions"],
        ),
        false,
      );
      assert.equal(
        helpers.containsEmployerIdentitySignals(
          "Opportunity with onequicksolutions hiring team.",
          ["OneQuickSolutions"],
        ),
        true,
      );
    },
  },
  {
    name: "validateCandidateAccessForRecruitment enforces consent and hiring visibility",
    run() {
      assert.equal(
        helpers.validateCandidateAccessForRecruitment(
          { consent: false, consentAcceptedAt: null },
          { isVisibleForHiring: true, profileStatus: "active" },
        ).error,
        "Candidate consent must be approved before continuing with recruitment actions.",
      );

      assert.equal(
        helpers.validateCandidateAccessForRecruitment(
          { consent: true, consentAcceptedAt: "2026-07-21T10:00:00.000Z" },
          { isVisibleForHiring: false, profileStatus: "deactivated" },
        ).error,
        "Your profile is currently not active for hiring. Reactivate it before showing interest or applying.",
      );

      assert.equal(
        helpers.validateCandidateAccessForRecruitment(
          { consent: true, consentAcceptedAt: "2026-07-21T10:00:00.000Z" },
          { isVisibleForHiring: true, profileStatus: "active" },
        ).ok,
        true,
      );
    },
  },
  {
    name: "buildCandidateJobFilter keeps jobs published and visible to the right audience",
    run() {
      const filter = helpers.buildCandidateJobFilter(
        {
          q: "qa",
          location: "Chennai",
          workMode: "hybrid",
          employmentType: "full-time",
          skills: "Selenium",
        },
        "experienced",
      );

      assert.equal(filter.$and[0].currentStatus.$in.includes("published"), true);
      assert.equal(filter.$and[1].applicationDeadline.$gte instanceof Date, true);
      assert.deepEqual(filter.$and.at(-1), {
        candidateAudience: { $in: ["all", "experienced"] },
      });
    },
  },
  {
    name: "validateScreeningAnswers preserves question order and blocks blanks",
    run() {
      const success = helpers.validateScreeningAnswers(
        [
          { id: "SQ-1", question: "Tell us about your QA experience." },
          { id: "SQ-2", question: "How do you write automation tests?" },
        ],
        [
          { questionId: "SQ-2", answer: "I focus on maintainable page objects." },
          { questionId: "SQ-1", answer: "Three years in API and UI automation." },
        ],
      );

      assert.equal(success.length, 2);
      assert.equal(success[0].questionId, "SQ-1");
      assert.equal(success[1].questionId, "SQ-2");

      const failure = helpers.validateScreeningAnswers(
        [{ id: "SQ-1", question: "Why this role?" }],
        [],
      );

      assert.equal(failure.error, "Answer the screening question: Why this role?");
    },
  },
  {
    name: "summarizeApplicationStatusCounts groups shortlists, interviews, and outcomes",
    run() {
      const summary = helpers.summarizeApplicationStatusCounts({
        application_submitted: 4,
        consultancy_shortlisted: 3,
        anonymous_profile_shared_with_company: 2,
        company_selected_for_interview: 1,
        interview_scheduled: 1,
        selected: 1,
        joined: 1,
      });

      assert.equal(summary.totalApplications, 13);
      assert.equal(summary.underReview, 4);
      assert.equal(summary.shortlisted, 9);
      assert.equal(summary.interviewCount, 4);
      assert.equal(summary.selectedCount, 2);
      assert.equal(summary.joinedCount, 1);
    },
  },
  {
    name: "buildCompanyAnonymousCandidateView does not expose personal candidate fields",
    run() {
      const view = helpers.buildCompanyAnonymousCandidateView(
        {
          shareReference: "SHR-OQS-000001",
          applicationReference: "APP-OQS-000001",
          anonymousCandidateReference: "CAN-OQS-000007",
          sharedAt: new Date("2026-07-21T10:00:00.000Z"),
        },
        {
          anonymousCandidateReference: "CAN-OQS-000007",
          candidateType: "experienced",
          qualification: "B.Tech",
          experienceRange: "4 years",
          relevantExperience: "3 years",
          skills: "Node.js, MongoDB",
          currentLocation: "Chennai",
          preferredLocation: "Remote",
          preferredRole: "Backend Engineer",
          noticePeriod: "30 days",
          expectedSalaryRange: "10 LPA",
          consultancyScreeningResult: "Strong shortlist",
          approvedComment: "Good production support depth.",
        },
        {
          applicationReference: "APP-OQS-000001",
          currentStatus: "anonymous_profile_shared_with_company",
        },
      );

      assert.equal(view.applicationReference, "APP-OQS-000001");
      assert.equal(view.anonymousCandidateReference, "CAN-OQS-000007");
      assert.equal("email" in view, false);
      assert.equal("phone" in view, false);
      assert.equal("fullName" in view, false);
    },
  },
  {
    name: "serializeNotificationView strips markup and exposes read state safely",
    run() {
      const view = helpers.serializeNotificationView({
        _id: "687d00000000000000000009",
        type: "INTERVIEW_SCHEDULED",
        title: "<strong>Interview Scheduled</strong>",
        message: "Please <script>alert(1)</script>review the latest update.",
        entityType: "<b>interview</b>",
        entityReference: "<a>APP-OQS-000021</a>",
        createdAt: new Date("2026-07-21T11:00:00.000Z"),
        readAt: null,
      });

      assert.equal(view.type, "interview_scheduled");
      assert.equal(view.title, "Interview Scheduled");
      assert.equal(view.message.includes("<"), false);
      assert.equal(view.entityType, "interview");
      assert.equal(view.entityReference, "APP-OQS-000021");
      assert.equal(view.isRead, false);
    },
  },
  {
    name: "protected APIs reject anonymous access and unmatched API routes stay JSON",
    async run() {
      const server = appModule.listen(0);

      try {
        await once(server, "listening");
        const { port } = server.address();
        const baseUrl = `http://127.0.0.1:${port}`;

        const authSessionResponse = await fetch(`${baseUrl}/api/auth/session`);
        assert.equal(authSessionResponse.status, 401);
        assert.equal(
          authSessionResponse.headers.get("content-type")?.includes("application/json"),
          true,
        );

        const companyDashboardResponse = await fetch(`${baseUrl}/api/company/dashboard`);
        assert.equal(companyDashboardResponse.status, 401);

        const companyJobsResponse = await fetch(`${baseUrl}/api/company/jobs`);
        assert.equal(companyJobsResponse.status, 401);
        assert.equal(
          companyJobsResponse.headers.get("content-type")?.includes("application/json"),
          true,
        );

        const notificationsResponse = await fetch(`${baseUrl}/api/notifications`);
        assert.equal(notificationsResponse.status, 401);

        const markNotificationResponse = await fetch(
          `${baseUrl}/api/notifications/test/read`,
          {
            method: "PATCH",
          },
        );
        assert.equal(markNotificationResponse.status, 401);

        const markAllNotificationsResponse = await fetch(
          `${baseUrl}/api/notifications/read-all`,
          {
            method: "POST",
          },
        );
        assert.equal(markAllNotificationsResponse.status, 401);

        const missingApiResponse = await fetch(`${baseUrl}/api/route-that-does-not-exist`);
        assert.equal(missingApiResponse.status, 404);
        assert.equal(
          missingApiResponse.headers.get("content-type")?.includes("application/json"),
          true,
        );
      } finally {
        await new Promise((resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        });
      }
    },
  },
];

let failures = 0;

(async () => {
  for (const testCase of cases) {
    try {
      await testCase.run();
      console.log(`PASS ${testCase.name}`);
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${testCase.name}`);
      console.error(error.stack || error.message);
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} test(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log(`\n${cases.length} test(s) passed.`);
  }
})();

import { ShieldCheck, Printer } from 'lucide-react';

interface ConsentModalProps {
  onConsent: (consent: boolean) => void;
}

export default function ConsentModal({ onConsent }: ConsentModalProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white sm:rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-screen sm:max-h-[calc(100vh-2rem)]">

        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 text-center shrink-0">
          <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 text-primary-600 mx-auto mb-3" />
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-1">Study Information Sheet</p>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
            Evaluating the Effectiveness of ScholarScaffold
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-Guided Research Literacy and Scholarly Proposal Development Platform
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Towson University | IRB Standard Review | Expedited Category 7
          </p>
          <button
            onClick={() => window.print()}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print or save a copy
          </button>
        </div>

        {/* Scrollable body — Sections 1–11 */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-4">
          <div className="space-y-5 text-sm text-gray-700">

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">1. Purpose of This Study</h2>
              <p className="mb-2">
                This document provides information about a research study being conducted by faculty at Towson
                University. Please read it carefully before deciding whether to participate. You are being invited
                to participate because you are enrolled in a course that uses ScholarScaffold, a web-based platform
                designed to guide students through the scholarly proposal development process.
              </p>
              <p className="mb-2">
                The purpose of this research study is to evaluate whether structured, AI-guided scaffolding through
                ScholarScaffold produces measurable improvement in the quality of scholarly research proposals, as
                reflected in rubric scores from a first draft to a revised draft. The study also examines how
                students engage with each stage of the platform and what they think about the experience.
              </p>
              <p>
                This study involves research. Your participation is completely voluntary. Your decision to
                participate or not participate will have no effect on your grade, your standing in this course,
                or your relationship with your instructor or Towson University.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">2. What You Will Be Asked to Do</h2>
              <p className="mb-2">
                All students in this course will use ScholarScaffold as a course resource to complete their
                scholarly proposal assignment. The platform guides you through six sequential stages, each of
                which must be completed before moving to the next:
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                <li>Stage 1: Research Strategy Coach</li>
                <li>Stage 2: Research Design Literacy Module</li>
                <li>Stage 3: Article Review Builder</li>
                <li>Stage 4: Annotated Bibliography Builder</li>
                <li>Stage 5: Proposal Builder</li>
                <li>Stage 6: Rubric Scoring Engine</li>
              </ul>
              <p className="mb-2">
                If you agree to participate in this research study, your platform activity will be included in
                the research dataset. This includes your rubric scores on Draft 1 and Draft 2, the time you
                spent in each stage, which stages you completed, and your responses to a brief post-experience
                survey described below.
              </p>
              <p className="mb-2">
                At the end of your platform experience, you will be asked to complete a short survey of
                approximately 5 to 8 questions. The survey asks for your ratings of how easy the platform was
                to use and how valuable you found the learning experience, along with one or two open-ended
                questions asking you to describe your experience in your own words. The survey should take no
                more than 10 minutes to complete. You may skip any survey questions you prefer not to answer.
              </p>
              <p>
                If you choose not to participate in the research, you will still use ScholarScaffold for your
                coursework in exactly the same way. The only difference is that your data will not be included
                in the research dataset.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">3. Time Commitment</h2>
              <p>
                Your total time commitment for research-specific activities, meaning the consent process and
                the post-experience survey, is estimated at 10 to 15 minutes. Your engagement with
                ScholarScaffold itself is part of your normal coursework and is not additional time required
                for research participation.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">4. Who Can Participate</h2>
              <p className="mb-2">
                To participate in this study, you must meet all of the following criteria:
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                <li>Be 18 years of age or older</li>
                <li>Be currently enrolled in this course</li>
                <li>Be able to provide your own informed consent</li>
              </ul>
              <p>
                There are no other eligibility requirements. All enrolled students have equal access to
                ScholarScaffold as a course tool regardless of whether they choose to participate in the research.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">5. Risks and Discomforts</h2>
              <p className="mb-2">
                The risks associated with this study are minimal. There are no physical risks, no medical
                procedures, and no collection of sensitive personal information such as health records or
                financial information. The primary risk is loss of confidentiality, meaning that your identity
                could potentially be linked to your research data. This risk is minimized through the
                confidentiality protections described in Section 7 below.
              </p>
              <p className="mb-2">
                You may also experience mild discomfort if you feel concerned about your platform performance
                being used for research purposes. To address this, please know that the research investigator
                will not review or access any participant data until after your final course grade has been
                submitted. Your platform work cannot influence your grade in any way.
              </p>
              <p>
                If you become upset or distressed for any reason, whether related to this study or not, you
                are encouraged to contact the Towson University Counseling Center at{' '}
                <span className="text-primary-700">towson.edu/counseling</span>. If you are in crisis outside
                of regular business hours, the 988 Suicide and Crisis Lifeline is available 24 hours a
                day, 7 days a week by calling or texting{' '}
                <span className="font-medium">988</span>.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">6. Anticipated Benefits</h2>
              <p className="mb-2">
                You are not expected to benefit directly from your participation in this research study.
                However, by using ScholarScaffold as a course tool, you may experience improvement in your
                proposal writing skills and research literacy, regardless of whether you consent to the research.
              </p>
              <p>
                The findings of this study will benefit future students and health professions education
                programs by contributing to knowledge about whether AI-guided scaffolding can effectively
                support the development of scholarly research skills.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">7. Confidentiality</h2>
              <p className="mb-2">
                Your participation in this study is confidential, not anonymous. This means that the research
                team will be able to link your name to your data during the study period, but every reasonable
                step will be taken to protect your privacy. Specifically, the following protections are in place:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Upon consenting, you will be assigned a unique coded identifier. All research analyses will
                  use this coded identifier, not your name.
                </li>
                <li>
                  The file linking your name to your coded identifier will be stored separately from the
                  research dataset in a password-protected location accessible only to the Principal
                  Investigator and Co-Investigator.
                </li>
                <li>
                  This linkage file will be permanently destroyed within two years of the completion of
                  data collection.
                </li>
                <li>
                  Research data will be retained for a minimum of three years following publication or
                  presentation of results, in accordance with Towson University research data retention
                  policy, and then securely destroyed.
                </li>
                <li>
                  No identifying information will be included in any publication, conference presentation,
                  or report resulting from this study.
                </li>
                <li>
                  The Principal Investigator, who is also your course instructor, will not access or review
                  any participant data until after your final grade for this course has been submitted.
                </li>
                <li>
                  Your survey responses, including any open-ended written responses, will be reviewed and
                  analyzed only in de-identified form.
                </li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                Please be aware that although every effort will be made to protect your confidentiality,
                absolute confidentiality cannot be guaranteed.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">8. Voluntary Participation and Your Rights</h2>
              <p className="mb-2">
                Your participation in this research study is completely voluntary. It is your decision whether
                to participate. You may choose not to participate, and you may withdraw your consent and
                discontinue participation at any time, without penalty, without loss of any benefits to which
                you are already entitled, and without negatively affecting your relationship with Towson
                University, your course instructor, or your standing in this course.
              </p>
              <p className="mb-2">
                You do not have to answer any questions you do not want to answer, including any survey items,
                for any reason. If you choose to withdraw from the study, data collected up to the point of
                your withdrawal will be excluded from the research dataset upon your written or emailed
                request to the Principal Investigator.
              </p>
              <p>
                The Principal Investigator reserves the right to discontinue your participation in the study
                at any time if it becomes necessary to protect your welfare or the integrity of the research.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">9. Compensation</h2>
              <p>
                You will receive no compensation for your participation in this study. No course credit, extra
                credit, or other academic or financial incentive is offered for research participation.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">10. Data Security</h2>
              <p>
                All research data are stored on a secured server with role-based access controls, in
                accordance with Towson University Office of Technology Services Data Use Standards. Data will
                not be transmitted through unsecured channels or stored on personal devices.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-1">11. Contact Information</h2>
              <p className="mb-3">
                If you have questions about this study or wish to withdraw your consent, please contact the
                research team. If you have questions about your rights as a research participant, please
                contact the Towson University IRB Chair.
              </p>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 text-xs uppercase tracking-wide mb-1">Principal Investigator</p>
                  <p>Wendy Whitner, PhD, MPH, LSSBB</p>
                  <p className="text-gray-500">(410) 271-3966 | wwhitner@towson.edu</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 text-xs uppercase tracking-wide mb-1">Co-Investigator</p>
                  <p>Mona A. Mohamed, PhD</p>
                  <p className="text-gray-500">(410) 704-4376 | mmohamed@towson.edu</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 text-xs uppercase tracking-wide mb-1">IRB Chair</p>
                  <p>Dr. Elizabeth Katz</p>
                  <p className="text-gray-500">(410) 704-2236 | Office of Sponsored Programs and Research, Towson University</p>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Sticky footer — Section 12: Online Consent Statement */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 border-t border-gray-200 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Section 12 — Online Consent Statement
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-2">
            By clicking YES, you are indicating your understanding that:
          </p>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5 ml-1 mb-4">
            <li>You are being asked to participate in a research study.</li>
            <li>Your participation is completely voluntary and you may withdraw at any time without penalty.</li>
            <li>You do not have to answer any questions you do not want to answer.</li>
            <li>Your decision to participate or not participate will have no effect on your course grade or your standing with Towson University.</li>
            <li>You have had the opportunity to read this information sheet and ask questions before deciding.</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onConsent(true)}
              className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              YES, I agree to participate
            </button>
            <button
              onClick={() => onConsent(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              NO, I do not wish to participate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

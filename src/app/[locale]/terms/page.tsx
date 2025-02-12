import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function TermsAndConditions() {
  const t = useTranslations('terms');

  return (
    <section className='bg-black py-8 text-white'>
      <div className='container mx-auto space-y-10 px-4'>
        <div>
          <h1 className='text-4xl font-bold'>{t('title')}</h1>
          <span className='block text-base italic'>{t('updatedVersion')}</span>
          <p className='text-base'>{t('intro')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('general_title')}
          </h3>
          <p className='text-base'>{t('general_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('acceptanceOfTerms_title')}
          </h3>
          <p className='text-base'>{t('acceptanceOfTerms_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('warrantyDisclaimer_title')}
          </h3>
          <p className='text-base'>{t('warrantyDisclaimer_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('riskWarning_title')}
          </h3>
          <p className='text-base'>{t('riskWarning_content_1')}</p>
          <p className='text-center text-xl font-bold'>
            {t('riskWarning_content_2')}
          </p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('eligibility_title')}
          </h3>
          <p className='text-base'>{t('eligibility_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('automaticMarginCall_title')}
          </h3>
          <p className='text-base'>{t('automaticMarginCall_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('segregation_title')}
          </h3>
          <p className='text-base'>{t('segregation_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('content_title')}
          </h3>
          <p className='text-base'>{t('content_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('subscriberAgreement_title')}
          </h3>
          <p className='text-base'>{t('subscriberAgreement_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('termination_title')}
          </h3>
          <p className='text-base'>{t('termination_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('fees_title')}
          </h3>
          <p className='text-base'>{t('fees_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('conflictsOfInterest_title')}
          </h3>
          <p className='text-base'>{t('conflictsOfInterest_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('taxes_title')}
          </h3>
          <p className='text-base'>{t('taxes_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('dividends_title')}
          </h3>
          <p className='text-base'>{t('dividends_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('terminology_title')}
          </h3>
          <p className='text-base'>{t('terminology_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('third-PartyLimitations_title')}
          </h3>
          <p className='text-base'>{t('third-PartyLimitations_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('defectsAndInconsistencies_title')}
          </h3>
          <p className='text-base'>{t('defectsAndInconsistencies_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('communications_title')}
          </h3>
          <p className='text-base'>{t('communications_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('externalLinks_title')}
          </h3>
          <p className='text-base'>{t('externalLinks_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('applicablePolicies_title')}
          </h3>
          <p className='text-base'>{t('applicablePolicies_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('acceptanceOfTermsMarketData_title')}
          </h3>
          <p className='text-base'>
            {t('acceptanceOfTermsMarketData_content')}
            <Link
              className='terms__link'
              href='https://www.nyse.com/publicdocs/ctaplan/notifications/trader-update/Exhibit_B_Metered_Usage_Addendum_and_Non-Professional_Subscriber_Electronic.pdf'
              target='_blank'
            >
              {t('acceptanceOfTermsMarketData_link')}
            </Link>
            {t('acceptanceOfTermsMarketData_content_2')}
          </p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('KYCProgram_title')}
          </h3>
          <p className='text-base'>{t('KYCProgram_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('indemnification_title')}
          </h3>
          <p className='text-base'>{t('indemnification_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('customerAssets_title')}
          </h3>
          <p className='text-base'>{t('customerAssets_content')}</p>
        </div>
        <div>
          <h3 className='text-center text-2xl font-semibold'>
            {t('revisions_title')}
          </h3>
          <p className='text-base'>{t('revisions_content')}</p>
        </div>
      </div>
    </section>
  );
}

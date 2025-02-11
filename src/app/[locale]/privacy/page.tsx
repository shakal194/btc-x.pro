import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacyPolicy');

  const sections = [
    'collectionOfPersonalInformation',
    'informationAboutUseOfServices',
    'useOfYourPersonalInformation',
    'sharingOfYourPersonalInformation',
    'retentionOfYourPersonalInformation',
    'securityOfYourPersonalInformation',
    'changesToThisPrivacyPolicy',
  ];

  const signUpList = [
    'collectInformation_1',
    'collectInformation_2',
    'collectInformation_3',
    'collectInformation_4',
    'collectInformation_5',
    'collectInformation_6',
    'collectInformation_7',
  ];

  const serviceUsageInformation = [
    'financialInformation',
    'logInformation',
    'deviceInformation',
    'activitiesOnSite',
    'locationInformation',
    'informationCollectedByCookies',
  ];

  const personalInformationList = [
    'personalInformation_1',
    'personalInformation_2',
    'personalInformation_3',
    'personalInformation_4',
    'personalInformation_5',
    'personalInformation_6',
    'personalInformation_7',
    'personalInformation_8',
    'personalInformation_9',
    'personalInformation_10',
  ];

  const sharingCircumstances = [
    'btcXProEntities',
    'thirdPartyVendors',
    'mergerSale',
    'disclosureLegalProcess',
    'inconsistentActions',
    'userConsent',
  ];

  return (
    <main>
      <section className='bg-black py-8 text-white'>
        <div className='container mx-auto px-4'>
          <h1 className='mb-4 text-3xl font-bold'>{t('title')}</h1>
          <span className='text-sm italic'>{t('updatedVersion')}</span>

          <p className='mt-4'>{t('intro')}</p>

          <h4 className='mt-8 text-xl font-semibold'>{t('contents')}</h4>
          <ol className='ml-6 mt-2 list-decimal'>
            {sections.map((key) => (
              <li key={key}>{t(`sections.${key}`)}</li>
            ))}
          </ol>

          <ol className='mt-2 list-decimal'>
            <li className='mb-4 list-inside text-center text-3xl font-bold'>
              {t('sections.collectionOfPersonalInformation')}
              <p className='mb-4 text-left text-base font-semibold'>
                {t('collectionOfPersonalInformation.intro')}
              </p>
              <ul className='list-disc'>
                <li className='mb-4 list-inside text-center text-3xl font-bold'>
                  {t('collectionOfPersonalInformation.signUpTitle')}
                  <p className='mb-4 text-left text-base font-semibold'>
                    {t('collectionOfPersonalInformation.signUpContent')}
                  </p>
                  <ul className='ml-8 list-disc'>
                    {signUpList.map((key) => (
                      <li
                        className='mb-4 text-left text-base font-semibold'
                        key={key}
                      >
                        {t(`collectionOfPersonalInformation.signUpList.${key}`)}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className='mb-4 list-inside text-center text-3xl font-bold'>
                  {t('collectionOfPersonalInformation.contactUsTitle')}
                  <p className='mb-4 text-left text-base font-semibold'>
                    {t('collectionOfPersonalInformation.contactUsContent')}
                  </p>
                </li>
                <li className='mb-4 list-inside text-center text-3xl font-bold'>
                  {t('collectionOfPersonalInformation.invitesTitle')}
                  <p className='mb-4 text-left text-base font-semibold'>
                    {t('collectionOfPersonalInformation.invitesContent')}
                  </p>
                </li>
              </ul>
            </li>
            <li className='mb-4 list-inside text-center text-3xl font-bold'>
              {t('sections.informationAboutUseOfServices')}
              <p className='mb-4 text-left text-base font-semibold'>
                {t('informationAboutUseOfServices.intro')}
              </p>
              <ul className='ml-6 mt-2 list-disc'>
                {serviceUsageInformation.map((key) => (
                  <li
                    key={key}
                    className='mb-4 text-left text-base font-semibold'
                  >
                    {t(
                      `informationAboutUseOfServices.serviceUsageInformation.${key}`,
                    )}
                  </li>
                ))}
              </ul>
            </li>
            <li className='mb-4 list-inside text-center text-3xl font-bold'>
              {t('sections.useOfYourPersonalInformation')}
              <p className='mb-4 text-left text-base font-semibold'>
                {t('useOfYourPersonalInformation.intro')}
                {t('useOfYourPersonalInformation.details')}
              </p>
              <ul className='ml-6 mt-2 list-disc'>
                {personalInformationList.map((key) => (
                  <li
                    key={key}
                    className='mb-4 text-left text-base font-semibold'
                  >
                    {t(
                      `useOfYourPersonalInformation.personalInformationList.${key}`,
                    )}
                  </li>
                ))}
              </ul>
            </li>
            <li className='mb-4 list-inside text-center text-3xl font-bold'>
              {t('sections.sharingOfYourPersonalInformation')}
              <p className='mb-4 text-left text-base font-semibold'>
                {t('sharingOfYourPersonalInformation.intro')}
              </p>
              <ul className='ml-6 mt-2 list-disc'>
                {sharingCircumstances.map((key) => (
                  <li
                    key={key}
                    className='mb-4 text-left text-base font-semibold'
                  >
                    {t(
                      `sharingOfYourPersonalInformation.sharingCircumstances.${key}`,
                    )}
                  </li>
                ))}
              </ul>
              <p className='mb-4 text-left text-base font-semibold'>
                {t('sharingOfYourPersonalInformation.detail')}
              </p>
            </li>
            <li className='mb-4 list-inside text-center text-3xl font-bold'>
              {t('sections.retentionOfYourPersonalInformation')}
              <p className='mb-4 text-left text-base font-semibold'>
                {t('retentionOfYourPersonalInformation.intro')}
              </p>
            </li>
            <li className='mb-4 list-inside text-center text-3xl font-bold'>
              {t('sections.securityOfYourPersonalInformation')}
              <p className='mb-4 text-left text-base font-semibold'>
                {t('securityOfYourPersonalInformation.intro')}
              </p>
            </li>
            <li className='mb-4 list-inside text-center text-3xl font-bold'>
              {t('sections.changesToThisPrivacyPolicy')}
              <p className='mb-4 text-left text-base font-semibold'>
                {t('changesToThisPrivacyPolicy.intro')}
              </p>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}

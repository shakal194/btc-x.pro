import { useTranslations } from 'next-intl';

export default function FinancialCrimeCompliance() {
  const t = useTranslations('aml');

  // Список стран
  const countries = [
    'country_afghanistan',
    'country_albania',
    'country_algeria',
    'country_angola',
    'country_bangladesh',
    'country_barbados',
    'country_bolivia',
    'country_burkina_faso',
    'country_burundi',
    'country_cambodia',
    'country_cayman_islands',
    'country_central_african_republic',
    'country_chad',
    'country_china',
    'country_congo',
    'country_cote_divoire',
    'country_cuba',
    'country_ecuador',
    'country_egypt',
    'country_equatorial_guinea',
    'country_eritrea',
    'country_ghana',
    'country_guinea',
    'country_guinea_bissau',
    'country_guyana',
    'country_haiti',
    'country_iran',
    'country_iraq',
    'country_jamaica',
    'country_jordan',
    'country_lao_pdr',
    'country_lebanon',
    'country_libya',
    'country_mali',
    'country_morocco',
    'country_myanmar',
    'country_nepal',
    'country_nicaragua',
    'country_north_korea',
    'country_north_macedonia',
    'country_pakistan',
    'country_panama',
    'country_qatar',
    'country_saudi_arabia',
    'country_senegal',
    'country_somalia',
    'country_south_africa',
    'country_south_sudan',
    'country_sudan',
    'country_syria',
    'country_trinidad_and_tobago',
    'country_tunisia',
    'country_uganda',
    'country_vanuatu',
    'country_venezuela',
    'country_yemen',
    'country_zimbabwe',
  ];

  const disputedTerritories = [
    'country_crimea',
    'country_dpr',
    'country_lpr',
    'country_nagorno_karabakh',
    'country_palestine',
    'country_pridnestrovian_moldavian_republic',
    'country_abkhazia',
    'country_taiwan',
    'country_kosovo',
    'country_somaliland',
    'country_south_ossetia',
    'country_sahrawi_arab_democratic_republic',
    'country_northern_cyprus',
  ];

  return (
    <section className='bg-black py-8 text-white'>
      <div className='container mx-auto px-4'>
        <h1 className='mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl'>
          {t('financial_crime_compliance_statement')}
        </h1>

        <ol className='aml__list space-y-6'>
          <li>
            <h2 className='text-xl font-semibold'>{t('introduction.title')}</h2>
            <p>{t('introduction.paragraph1')}</p>
            <ul className='list-disc pl-5'>
              <li className='aml__item__subitem'>
                {t('introduction.list1_item1')}
              </li>
              <li className='aml__item__subitem'>
                {t('introduction.list1_item2')}
              </li>
            </ul>
            <p>{t('introduction.paragraph2')}</p>
          </li>

          <li>
            <h2 className='text-xl font-semibold'>{t('governance.title')}</h2>
            <p>{t('governance.paragraph1')}</p>
          </li>

          <li>
            <h2 className='text-xl font-semibold'>
              {t('policies_and_procedures.title')}
            </h2>
            <p>{t('policies_and_procedures.paragraph1')}</p>
            <ul className='list-disc pl-5'>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list1_item1')}
              </li>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list1_item2')}
              </li>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list1_item3')}
              </li>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list1_item4')}
              </li>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list1_item5')}
              </li>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list1_item6')}
              </li>
            </ul>
            <p>{t('policies_and_procedures.paragraph2')}</p>
            <ul className='list-disc pl-5'>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list2_item1')}
              </li>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list2_item2')}
              </li>
              <li className='aml__item__subitem'>
                {t('policies_and_procedures.list2_item3')}
              </li>
            </ul>
          </li>

          <li>
            <h2 className='text-xl font-semibold'>
              {t('mitigation_and_management_of_financial_crime_risks.title')}
            </h2>
            <p>
              {t(
                'mitigation_and_management_of_financial_crime_risks.paragraph1',
              )}
            </p>
            <ul className='list-disc pl-5'>
              <li className='aml__item__subitem'>
                {t(
                  'mitigation_and_management_of_financial_crime_risks.list1_item1',
                )}
              </li>
              <li className='aml__item__subitem'>
                {t(
                  'mitigation_and_management_of_financial_crime_risks.list1_item2',
                )}
              </li>
              <li className='aml__item__subitem'>
                {t(
                  'mitigation_and_management_of_financial_crime_risks.list1_item3',
                )}
              </li>
              <li className='aml__item__subitem'>
                {t(
                  'mitigation_and_management_of_financial_crime_risks.list1_item4',
                )}
              </li>
              <li className='aml__item__subitem'>
                {t(
                  'mitigation_and_management_of_financial_crime_risks.list1_item5',
                )}
              </li>
              <li className='aml__item__subitem'>
                {t(
                  'mitigation_and_management_of_financial_crime_risks.list1_item6',
                )}
              </li>
              <li className='aml__item__subitem'>
                {t(
                  'mitigation_and_management_of_financial_crime_risks.list1_item7',
                )}
              </li>
            </ul>
          </li>

          <li>
            <h2 className='text-xl font-semibold'>
              {t('country_of_residence.title')}
            </h2>
            <p>{t('country_of_residence.paragraph1')}</p>
            <ul className='country__list list-disc pl-5'>
              {countries.map((key) => (
                <li key={key} className='aml__item__subitem'>
                  {t(`country_of_residence.${key}`)}
                </li>
              ))}
            </ul>
            <p className='mt-6'>{t('disputed_territories.paragraph')}</p>
            <ul className='list-disc pl-5'>
              {disputedTerritories.map((key) => (
                <li key={key} className='aml__item__subitem'>
                  {t(
                    `disputed_territories.disputed_country_territories.${key}`,
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ol>
      </div>
    </section>
  );
}

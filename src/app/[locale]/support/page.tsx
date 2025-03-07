'use client';
/*
import { LiveChatWidget, EventHandlerPayload } from '@livechat/widget-react';

export default function LiveChat() {
  function handleNewEvent(event: EventHandlerPayload<'onNewEvent'>) {
    console.log('LiveChatWidget.onNewEvent', event);
  }

  return (
    <LiveChatWidget
      license='18749046'
      visibility='maximized'
      onNewEvent={handleNewEvent}
    />
  );
}
*/
import { Form, Input, Button } from '@heroui/react';
import { useState, useMemo } from 'react';
import Notiflix from 'notiflix';
import FullScreenSpinner from '@/components/ui/Spinner';
import { useTranslations } from 'next-intl';

export default function SupportPage() {
  const t = useTranslations('supportPage');

  const [value, setValue] = useState('btc-x.pro');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (value === '') return true;

    return validateEmail(value) ? false : true;
  }, [value]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (!data.email) {
      setErrors({ email: t('form_require') });
      return;
    }

    if (isInvalid) {
      setErrors({ email: t('form_error_title') });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/deleteEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      });

      const result = await response.json();

      if (response.ok) {
        Notiflix.Notify.success(`${t('form_success_message')}`);
        setValue('');
      } else {
        Notiflix.Notify.failure(`${t('form_success_message')}`);
      }
    } catch (error) {
      Notiflix.Notify.failure(`${t('form_error_unknown')}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className='relative z-20 rounded-xl bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
        <div className='container mx-auto space-y-8 p-4'>
          {isSubmitting && <FullScreenSpinner />}
          <h2 className='p-4 text-font16Leading120 lg:text-font22Leading120'>
            {t('title')}
          </h2>
          <div className='mb-20'>
            <Form
              className='mx-auto w-full max-w-xs gap-3'
              validationErrors={errors}
              onSubmit={onSubmit}
            >
              <Input
                label='Email'
                labelPlacement='outside'
                color={isInvalid ? 'danger' : 'success'}
                isInvalid={isInvalid}
                name='email'
                placeholder='Enter your email in BTC-X.pro'
                isRequired
                errorMessage={t('form_error_title')}
                type='email'
                value={value}
                variant='bordered'
                onValueChange={setValue}
                onClear={() => {}}
              />
              <Button
                type='submit'
                variant='solid'
                color={isInvalid ? 'danger' : 'success'}
              >
                {t('button')}
              </Button>
            </Form>
          </div>
        </div>
      </section>
    </main>
  );
}

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { ETHICS_PRINCIPLES_URL } from '../../../types/constants/paths';
import { EthicsPrinciplesCheckbox } from './EthicsPrinciplesCheckbox';

describe('EthicsPrinciplesCheckbox', () => {
  describe('renders', () => {
    it('include the checkbox', () => {
      render(
        <Formik initialValues={{ ethicsPrinciplesAttested: false }} onSubmit={jest.fn()}>
          <Form noValidate>
            <EthicsPrinciplesCheckbox />
          </Form>
        </Formik>,
      );

      const checkbox = screen.getByRole('checkbox', {
        name: 'I attest that I have read, understood, and agree to the Ethics Principles for Access to and Use of Veteran Data.',
      });
      expect(checkbox).toBeInTheDocument();
    });

    it('include the description and link', () => {
      render(
        <Formik initialValues={{ ethicsPrinciplesAttested: false }} onSubmit={jest.fn()}>
          <Form noValidate>
            <EthicsPrinciplesCheckbox />
          </Form>
        </Formik>,
      );

      const termsLink = screen.getByRole('link', {
        name: 'Ethics Principles for Access to and Use of Veteran Data',
      });
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href', ETHICS_PRINCIPLES_URL);
      expect(termsLink.parentElement).toHaveTextContent(
        'Review our Ethics Principles for Access to and Use of Veteran Data.(*Required)',
      );

      // ensure terms of service link opens in a new tab
      expect(termsLink).toHaveAttribute('target', '_blank');
      expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('changes the ethicsPrinciplesAttested value', () => {
    const testValueChange = (initialValue: boolean) => async (): Promise<void> => {
      const checkValue = jest.fn(({ ethicsPrinciplesAttested }): void => {
        expect(ethicsPrinciplesAttested).toBe(!initialValue);
      });

      render(
        <Formik initialValues={{ ethicsPrinciplesAttested: initialValue }} onSubmit={checkValue}>
          <Form noValidate>
            <EthicsPrinciplesCheckbox />
            <button type="submit">Submit</button>
          </Form>
        </Formik>,
      );

      await userEvent.click(
        screen.getByRole('checkbox', {
          name: 'I attest that I have read, understood, and agree to the Ethics Principles for Access to and Use of Veteran Data.',
        }),
      );
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      // don't want test to pass without running assertion, so we run this check to fail the test
      // if it didn't run
      await waitFor(() => expect(checkValue).toHaveBeenCalledTimes(1));
    };

    it('from no to yes', testValueChange(false));
    it('from yes to no', testValueChange(true));
  });

  describe('validation', () => {
    const schema = yup.object().shape({
      ethicsPrinciplesAttested: yup.boolean().oneOf([true], 'Accept the terms or else.').required(),
    });

    it('does not have an error message when there is no error', async () => {
      const submitMock = jest.fn();
      render(
        <Formik
          initialValues={{ ethicsPrinciplesAttested: false }}
          onSubmit={submitMock}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={schema}
        >
          <Form noValidate>
            <EthicsPrinciplesCheckbox />
            <button type="submit">Submit</button>
          </Form>
        </Formik>,
      );

      await userEvent.click(
        screen.getByRole('checkbox', {
          name: 'I attest that I have read, understood, and agree to the Ethics Principles for Access to and Use of Veteran Data.',
        }),
      );
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1));
      expect(screen.queryByText('Accept the terms or else.')).toBeNull();
    });

    it('shows an error message when there is an error', async () => {
      const submitMock = jest.fn();
      render(
        <Formik
          initialValues={{ ethicsPrinciplesAttested: false }}
          onSubmit={submitMock}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={schema}
        >
          <Form noValidate>
            <EthicsPrinciplesCheckbox />
            <button type="submit">Submit</button>
          </Form>
        </Formik>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(async () => {
        expect(await screen.findByText('Accept the terms or else.')).toBeInTheDocument();
      });

      expect(submitMock).not.toHaveBeenCalled();
    });
  });
});

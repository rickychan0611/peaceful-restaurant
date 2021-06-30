import { Form, Button, Icon, Modal, Header, Divider } from 'semantic-ui-react';
import useTranslation from 'next-translate/useTranslation';
import InputMask from 'react-input-mask';

const AddressEditModal = ({
  open,
  setOpen,
  loading,
  saveAddressQuery,
  err,
  selectedAddress,
  setSelectedAddress
}) => {
  const { t } = useTranslation('profile');

  const handleChange = (e, name) => {
    setSelectedAddress((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const formItems = [
    {
      label: t`FirstName`,
      key: 'first_name',
      required: true
    },
    {
      label: t`LastName`,
      key: 'last_name',
      required: true
    },
    {
      label: t`PhoneNumber`,
      key: 'phone',
      required: true
    },
    {
      label: t`Address`,
      key: 'detail_address',
      required: true
    },
    {
      label: t`City`,
      key: 'city',
      required: true
    },
    {
      label: t`Province`,
      key: 'province',
      required: true
    },
    {
      label: t`Post Code`,
      key: 'post_code',
      required: false
    },
    {
      label: t`Country`,
      key: 'country',
      required: false
    }
  ];

  return (
    <Modal open={open} style={{maxWidth: 400}}>
      <Header content={selectedAddress && t(selectedAddress.type).toUpperCase()} />
      <Form onSubmit={saveAddressQuery} style={{ padding: 20 }}>
        {formItems.map((item, i) => {
          return item.key === 'phone' ? (
            <Form.Input
              key={i}
              fluid
              required={item.required}
              label={item.label}
              placeholder={item.label}
              value={selectedAddress && selectedAddress[item.key]}
              onChange={(e) => {
                handleChange(e, item.key);
              }}
              error={err && err[item.key]}
              children={
                item.key === 'phone' && (
                  <>
                    <InputMask
                      mask="999-999-9999"
                      maskChar="_"
                      alwaysShowMask
                      placeholder={item.label}
                      value={selectedAddress && selectedAddress[item.key]}
                      onChange={(e) => {
                        handleChange(e, item.key);
                      }}
                    />
                  </>
                )
              }
            />
          ) : (
            <Form.Input
              key={i}
              fluid
              required={item.required}
              label={item.label}
              placeholder={item.label}
              value={selectedAddress && selectedAddress[item.key]}
              onChange={(e) => {
                handleChange(e, item.key);
              }}
              error={err && err[item.key]}
            />
          );
        })}
        <Divider />
        <Button onClick={() => !loading && setOpen(false)}>
          <Icon name="remove" /> {t`Cancel`}
        </Button>
        <Button
          type="submit"
          style={{ backgroundColor: '#ff614d', color: 'white', marginLeft: 10 }}
        >
          {loading ? (
            <>
              <Icon loading name="spinner" />
              {t`Saving`}
            </>
          ) : (
            <>
              <Icon name="checkmark" /> {t`Save`}
            </>
          )}
        </Button>
        {/* </Modal.Actions> */}
      </Form>
    </Modal>
  );
};

export default AddressEditModal;

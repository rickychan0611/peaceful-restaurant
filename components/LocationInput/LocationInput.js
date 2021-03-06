import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import useTranslation from 'next-translate/useTranslation';

const LocationInput = ({value, setValue}) => {
  // const [value, setValue] = useState();
  const { t } = useTranslation('home');

  return (
    <>
      <GooglePlacesAutocomplete
        autocompletionRequest={{
          componentRestrictions: {
            country: ['ca']
          }
        }}
        selectProps={{
          placeholder: t('enterAddress'),
          value,
          onChange: setValue,
          styles: {
            input: (provided) => ({
              ...provided,
              border: 'none',
              width: '33vw',
              textAlign : "left"
            }),
            control: (provided) => ({
              ...provided,
              borderColor: 'white',
              boxShadow: 'none',
            })
          }
        }}
      />
    </>
  );
};


export default LocationInput;

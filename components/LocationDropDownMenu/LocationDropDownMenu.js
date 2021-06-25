import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import {
  selectedLocation as selectedLocationAtom
} from '../../data/atoms.js';
import {useIsDesktop} from '../../util/useScreenSize';

const locations = [
  { id: 2, name: 'Broadway' },
  { id: 4, name: 'Kitsilano' },
  { id: 9, name: 'Richmond' },
  { id: 8, name: 'Port Coquitlam' },
  { id: 7, name: 'Kingsway' },
  { id: 5, name: 'Seymour' },
  { id: 6, name: 'Newton' },
  { id: 3, name: 'Mount Pleasant' }
];

const LocationDropDownMenu = ( {setOpenDropdownMenu} ) => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationAtom);
  const isDesktop = useIsDesktop();

  return (
    <>
      <DropDownContainer  isDesktop={isDesktop}>
        <DropDownMenu>
          {locations.map((item, i) => {
            return (
              <MenuItem
                selected={selectedLocation && selectedLocation.id === item.id}
                last={i === locations.length - 1}
                className={i === locations.length - 1 ? 'last' : 'front'}
                onClick={() => {
                  router.push('/shop/' + item.name + '/' + item.id);
                  setOpenDropdownMenu(false);
                  setSelectedLocation(item);
                }}>
                {item.name}
              </MenuItem>
            );
          })}
        </DropDownMenu>
      </DropDownContainer>
    </>
  );
};

const DropDownContainer = styled.div`
  position: ${p => !p.isDesktop ? "fixed" : "absolute"};
  right:  10px;
  /* margin-right: 10px; */
  z-index: 10;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: ${p => !p.isDesktop ? "200px" : "none"};
  padding-top: 5px;
  cursor: pointer;
`;
const DropDownMenu = styled.div`
  background-color: white;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  border: 1px solid #adadad;
  border-radius: 0px 0px 15px 15px;
  text-align: left;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  .front:hover {
    background-color: #bebe51;
  }
  .last:hover {
    background-color: #bebe51;
    border-radius: 0px 0px 15px 15px;
  }
`;

const MenuItem = styled.h4`
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 15px 10px 15px 10px;
  border-bottom: ${(p) => !p.last && '1px solid #b3b3b3'};
  background-color: ${(p) => p.selected && '#bebe51'};
  border-radius: ${(p) => p.selected && p.last && '0px 0px 15px 15px'};
`;

export default LocationDropDownMenu;

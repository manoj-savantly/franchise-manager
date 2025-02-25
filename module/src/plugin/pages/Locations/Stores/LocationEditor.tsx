import { Form, FormField, Icon } from '@sprout-platform/ui';
import { css, cx } from 'emotion';
import { Field, FieldArray, FormikHelpers } from 'formik';
import { AppModuleRootState } from 'plugin/types';
import React, { Fragment, ReactElement, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { FranchiseGroup, franchiseGroupsStateProvider } from '../Groups/entity';
import { franchiseMarketStateProvider } from '../Markets/entity';
import { FranchiseLocation } from '../types';
import { FranchiseLocationFeeEditor } from './components/FranchiseLocationFeeEditor';
import { FranchiseLocationMemberEditor } from './components/LocationMembersEditor';
import { useFMLocationFees, useFMLocationMembers } from './hooks';

const RemoveItemButton = ({ remove, index }: { remove: (index: number) => void; index: number }) => {
  return (
    <Icon
      name="trash-alt"
      size={'2x'}
      className={cx('text-danger', 'mb-2')}
      color="danger"
      onClick={() => {
        remove(index);
      }}
    />
  );
};

const FieldArrayWrapper = ({ children, header }: { children: ReactElement; header: string }) => {
  return (
    <Row>
      <Col>
        <div
          className={cx(
            'justify-content-between',
            css`
              display: flex;
            `
          )}
        >
          <h5>{header}</h5>
        </div>
        {children}
      </Col>
    </Row>
  );
};

const BuildingEditControl = () => {
  return (
    <div>
      <h5>Building</h5>
      <Row>
        <div className="col">
          <div className="form-group">
            <label>Total sq ft.</label>
            <Field className="form-control" name="building.totalSquareFeet" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>FOH sq. ft.</label>
            <Field className="form-control" name="building.fohSquareFeet" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>BOH sq. ft.</label>
            <Field className="form-control" name="building.bohSquareFeet" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Max Occupancy</label>
            <Field className="form-control" name="building.maxOccupancy" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Max Seating</label>
            <Field className="form-control" name="building.maxSeating" as="input" type="number" />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Lease Sign Date</label>
            <Field className="form-control" name="building.leaseSignDate" as="input" type="date" />
          </div>
        </div>
      </Row>
    </div>
  );
};

const HoursControl = ({ location }: { location: FranchiseLocation }) => {
  return (
    <Fragment>
      <h5>Hours of Operation</h5>
      <Row>
        <Col xs={6} sm={4} md={3} lg={2} className="no-gutters">
          <FormField name="hours.sundayOpen" label="Sunday Open" type="time" />
          <FormField name="hours.sundayClose" label="Sunday Close" type="time" />
        </Col>
        <Col xs={6} sm={4} md={3} lg={2} className="no-gutters">
          <FormField name="hours.mondayOpen" label="Monday Open" type="time" />
          <FormField name="hours.mondayClose" label="Monday Close" type="time" />
        </Col>
        <Col xs={6} sm={4} md={3} lg={2} className="no-gutters">
          <FormField name="hours.tuesdayOpen" label="Tuesday Open" type="time" />
          <FormField name="hours.tuesdayClose" label="Tuesday Close" type="time" />
        </Col>
        <Col xs={6} sm={4} md={3} lg={2} className="no-gutters">
          <FormField name="hours.wednesdayOpen" label="Wednesday Open" type="time" />
          <FormField name="hours.wednesdayClose" label="Wednesday Close" type="time" />
        </Col>
        <Col xs={6} sm={4} md={3} lg={2} className="no-gutters">
          <FormField name="hours.thursdayOpen" label="Thursday Open" type="time" />
          <FormField name="hours.thursdayClose" label="Thursday Close" type="time" />
        </Col>
        <Col xs={6} sm={4} md={3} lg={2} className="no-gutters">
          <FormField name="hours.fridayOpen" label="Friday Open" type="time" />
          <FormField name="hours.fridayClose" label="Friday Close" type="time" />
        </Col>
        <Col xs={6} sm={4} md={3} lg={2} className="no-gutters">
          <FormField name="hours.saturdayOpen" label="Saturday Open" type="time" />
          <FormField name="hours.saturdayClose" label="Saturday Close" type="time" />
        </Col>
      </Row>

      <FieldArrayWrapper header="Modified Hours">
        <FieldArray name="modifiedHours">
          {({ insert, remove, push }) => (
            <Fragment>
              <Button
                color="info"
                onClick={() => {
                  push({
                    totalSquareFeet: 0,
                  });
                }}
              >
                Add Modified Hours
              </Button>
              <div className="form-inline ml-1">
                {location.modifiedHours &&
                  location.modifiedHours.length > 0 &&
                  location.modifiedHours.map((bar, index) => (
                    <div key={`modifiedHours-${index}`} className="form-row mt-2">
                      <RemoveItemButton index={index} remove={remove} />
                      <div className="input-group mr-2">
                        <label htmlFor={`modifiedHours.${index}.dateToModify`} className="mr-2 sr-only">
                          Date
                        </label>
                        <div className="input-group-prepend">
                          <div className="input-group-text">Date</div>
                        </div>
                        <Field name={`modifiedHours.${index}.dateToModify`} type="date" className="form-control" />
                      </div>
                      <div className="input-group mr-2">
                        <label htmlFor={`modifiedHours.${index}.openTime`} className="mr-2 sr-only">
                          Open Time
                        </label>
                        <div className="input-group-prepend">
                          <div className="input-group-text">Open</div>
                        </div>
                        <Field
                          name={`modifiedHours.${index}.openTime`}
                          label="Open Time"
                          type="time"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mr-2">
                        <label htmlFor={`modifiedHours.${index}.closeTime`} className="mr-2 sr-only">
                          Close Time
                        </label>
                        <div className="input-group-prepend">
                          <div className="input-group-text">Close</div>
                        </div>
                        <Field
                          name={`modifiedHours.${index}.closeTime`}
                          label="Close Time"
                          type="time"
                          className="form-control"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Fragment>
          )}
        </FieldArray>
      </FieldArrayWrapper>
    </Fragment>
  );
};

const BarsEditControl = ({ location }: { location: FranchiseLocation }) => {
  return (
    <FieldArrayWrapper header="Bars">
      <FieldArray name="bars">
        {({ insert, remove, push }) => (
          <Fragment>
            <Button
              color="info"
              onClick={() => {
                push({
                  linearFeet: 0,
                  beer: true,
                  liquor: true,
                  standalone: false,
                });
              }}
            >
              Add Bar
            </Button>
            <div className="form-inline p-2">
              {location.bars &&
                location.bars.length > 0 &&
                location.bars.map((bar, index) => (
                  <div className="form-row" key={`bars-${index}`}>
                    <RemoveItemButton index={index} remove={remove} />
                    <div className="input-group mr-2">
                      <label htmlFor={`bars.${index}.linearFeet`} className="mr-2">
                        Linear Feet
                      </label>
                      <Field
                        name={`bars.${index}.linearFeet`}
                        label="Linear Feet"
                        type="number"
                        className="form-control"
                      />
                    </div>
                    <div className="form-check form-check-inline">
                      <Field name={`bars.${index}.liquor`} type="checkbox" className={'form-check-input'} />
                      <label htmlFor={`bars.${index}.liquor`} className={'form-check-label'}>
                        Liquor
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <Field name={`bars.${index}.beer`} type="checkbox" className={'form-check-input'} />
                      <label htmlFor={`bars.${index}.beer`} className={'form-check-label'}>
                        Beer
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <Field name={`bars.${index}.standalone`} type="checkbox" className={'form-check-input'} />
                      <label htmlFor={`bars.${index}.standalone`} className={'form-check-label'}>
                        Stand-alone
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          </Fragment>
        )}
      </FieldArray>
    </FieldArrayWrapper>
  );
};

const PatiosEditControl = ({ location }: { location: FranchiseLocation }) => {
  return (
    <FieldArrayWrapper header="Patios">
      <FieldArray name="patios">
        {({ insert, remove, push }) => (
          <Fragment>
            <Button
              color="info"
              onClick={() => {
                push({
                  totalSquareFeet: 0,
                });
              }}
            >
              Add Patio
            </Button>
            <div className="form-inline p-2">
              {location.patios &&
                location.patios.length > 0 &&
                location.patios.map((bar, index) => (
                  <div key={`patio-${index}`} className="form-row">
                    <RemoveItemButton index={index} remove={remove} />
                    <div className="input-group mr-2">
                      <label htmlFor={`patios.${index}.totalSquareFeet`} className="mr-2 sr-only">
                        Total sq. ft.
                      </label>
                      <div className="input-group-prepend">
                        <div className="input-group-text">sqft.</div>
                      </div>
                      <Field name={`patios.${index}.totalSquareFeet`} type="number" className="form-control" />
                    </div>
                  </div>
                ))}
            </div>
          </Fragment>
        )}
      </FieldArray>
    </FieldArrayWrapper>
  );
};

const TabEntry = ({
  activeTab,
  toggle,
  tabId,
  tabText,
}: {
  activeTab: string;
  toggle: (tabId: string) => void;
  tabId: string;
  tabText: string;
}) => {
  return (
    <NavItem>
      <NavLink
        className={cx({ active: activeTab === tabId })}
        onClick={() => {
          toggle(tabId);
        }}
      >
        {tabText}
      </NavLink>
    </NavItem>
  );
};

export const LocationEditor = ({
  location,
  onSubmit,
}: {
  location: FranchiseLocation;
  onSubmit: (values: FranchiseLocation, helpers: FormikHelpers<FranchiseLocation>) => void;
}) => {
  const fmSelectOptions = useSelector((state: AppModuleRootState) => state.franchiseManagerState.fmSelectOptions);
  const marketState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.marketState);
  const groupState = useSelector((state: AppModuleRootState) => state.franchiseManagerState.groupState);
  const [activeTab, setActiveTab] = useState('details');
  const dispatch = useDispatch();
  const fmLocationMembers = useFMLocationMembers(location.id);
  const fmLocationFees = useFMLocationFees(location.id);

  const toggle = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useMemo(() => {
    if (!marketState.isFetched && !marketState.isFetching) {
      dispatch(franchiseMarketStateProvider.loadState());
    }
    if (!groupState.isFetched && !groupState.isFetching) {
      dispatch(franchiseGroupsStateProvider.loadState());
    }
  }, [marketState, groupState, dispatch]);

  useMemo(() => {
    if (fmLocationMembers) {
      location.members = fmLocationMembers;
    }
  }, [fmLocationMembers, location]);

  useMemo(() => {
    if (fmLocationFees) {
      location.fees = fmLocationFees;
    }
  }, [fmLocationFees, location]);

  return (
    <div>
      <Form
        showButtonsOnTop={true}
        showCancelButton={false}
        submitText="Save"
        initialValues={location}
        onSubmit={(values, helpers) => {
          onSubmit(values, helpers);
        }}
      >
        {({ values }) => {
          return (
            <div className={cx('pt-2')}>
              <Nav tabs>
                <TabEntry tabId="details" tabText="Details" activeTab={activeTab} toggle={toggle} />
                <TabEntry tabId="hours" tabText="Hours" activeTab={activeTab} toggle={toggle} />
                <TabEntry tabId="members" tabText="Members" activeTab={activeTab} toggle={toggle} />
                <TabEntry tabId="fees" tabText="Fees" activeTab={activeTab} toggle={toggle} />
              </Nav>
              <TabContent
                activeTab={activeTab}
                className={cx(
                  'pt-2',
                  css`
                    border-top: #ddd solid 1px;
                  `
                )}
              >
                <TabPane tabId="details">
                  <Fragment>
                    <Row>
                      <FormField name="name" type="text" label="Name" placeholder="Enter the location name" />
                      <FormField name="phoneNumber" label="Phone Number" />
                      <FormField as="select" name="groupId" label="Group">
                        {groupState.response &&
                          (groupState.response.content as FranchiseGroup[]).map((t, index) => (
                            <option key={index} value={t.id?.itemId}>
                              {t.name}
                            </option>
                          ))}
                      </FormField>
                    </Row>
                    <Row>
                      <FormField name="address1" label="Address" />
                      <FormField name="address2" label="Suite" />
                      <FormField name="city" label="City" />
                      <FormField name="state" label="State" />
                      <FormField name="zip" label="Zip Code" />
                    </Row>
                    <Row>
                      <FormField as="select" name="concept" label="Concept">
                        {fmSelectOptions.concepts &&
                          fmSelectOptions.concepts.map((t, index) => (
                            <option key={index} value={t}>
                              {t}
                            </option>
                          ))}
                      </FormField>
                      <FormField as="select" name="locationType" label="Location Type">
                        {fmSelectOptions.locationTypes &&
                          fmSelectOptions.locationTypes.map((t, index) => (
                            <option key={index} value={t}>
                              {t}
                            </option>
                          ))}
                      </FormField>
                      <FormField as="select" name="marketId" label="Market">
                        {marketState.response?.content &&
                          marketState.response.content.map((t, index) => (
                            <option key={index} value={t.id?.itemId}>
                              {t.name}
                            </option>
                          ))}
                      </FormField>
                      <FormField as="input" name="pos.virtualTerminals" label="Virtual Terminals" />
                      <FormField as="input" name="pos.physicalTerminals" label="Physical Terminals" />
                    </Row>
                    <hr />
                    <BuildingEditControl />
                    <hr />
                    <BarsEditControl location={values} />
                    <hr />
                    <PatiosEditControl location={values} />
                    <hr className="mb-3" />
                  </Fragment>
                </TabPane>
                <TabPane tabId="hours">
                  <HoursControl location={values} />
                </TabPane>
                <TabPane tabId="members">
                  <FranchiseLocationMemberEditor location={values} />
                </TabPane>
                <TabPane tabId="fees">
                  <FranchiseLocationFeeEditor location={values} name="fees" />
                </TabPane>
              </TabContent>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

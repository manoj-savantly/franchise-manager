import { dateTime } from '@savantly/sprout-api';
import { css } from 'emotion';
import { useFMLocation } from 'plugin/pages/Locations/Stores/hooks';
import React, { Fragment, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { useQAISection } from '../../sections/hooks';
import { QAISectionSubmission, qaiSubmissionService } from '../entity';

type InternalState = QAISectionSubmission | undefined;
const QAISubmissionViewPage = () => {
  const itemId = useParams().itemId;
  const [item, setItem] = useState(undefined as InternalState);
  const [error, setError] = useState('');
  const fmLocation = useFMLocation(item?.locationId);

  const qaiSection = useQAISection(item?.sectionId);

  if (!itemId) {
    const message = 'An itemId was not provided';
    console.error(message);
    setError(message);
  }

  useMemo(() => {
    if (!item) {
      qaiSubmissionService
        .getById(itemId)
        .then(response => {
          setItem(response.data);
        })
        .catch(err => {
          console.error(err);
          setError(err.message || 'There was a problem retrieving the submission');
        });
    }
  }, [itemId, item]);

  const getQuestionText = (questionId?: string) => {
    if (qaiSection && questionId) {
      if (qaiSection) {
        const list = qaiSection.questions.filter(q => q.itemId === questionId);
        if (list && list.length > 0) {
          return list[0].text;
        }
      }
    }
    return 'text unavailable';
  };

  const getGuestQuestionText = (questionId?: string) => {
    if (qaiSection && questionId) {
      if (qaiSection) {
        const list = qaiSection.guestQuestions.filter(q => q.itemId === questionId);
        if (list && list.length > 0) {
          return list[0].text;
        }
      }
    }
    return 'text unavailable';
  };

  return (
    <Fragment>
      {error && <Alert color="warning">{error}</Alert>}
      {item && qaiSection && (
        <div>
          <h4>Location: {fmLocation?.name}</h4>
          <h4>Section: {qaiSection.name}</h4>
          <h4>Date Scored: {dateTime(item.dateScored).format('dd YYYY-MM-DD hh:mm A')}</h4>
          <hr />
          <div className="mb-2">
            <h5>Details</h5>
            {item.staffAttendance && (
              <div>
                <label className="mr-2">Staff Attendance Log: </label>
                <span>
                  {Object.keys(item.staffAttendance).map(o => (
                    <Fragment>
                      <i>{o}</i>
                      {item.staffAttendance && item.staffAttendance[o]}
                    </Fragment>
                  ))}
                </span>
              </div>
            )}

            <div>
              <label className="mr-2">Questions: </label>
              <table className="table table-sm">
                <tbody>
                  {item.answers &&
                    item.answers.map(c => (
                      <Fragment>
                        <tr className="d-flex">
                          <td className="col-5">{getQuestionText(c.questionId)}</td>
                          <td className="col-2">{c.value}</td>
                          <td className="col-5">{c.notes}</td>
                        </tr>
                        <tr className="d-flex">
                          <td className="col-12 d-flex">
                            {c.attachments.map(attachment => (
                              <div className="col-4">
                                <div
                                  className={css`
                                    text-align: center;
                                  `}
                                >
                                  <a href={attachment.downloadUrl}>Download</a>
                                </div>
                                <img src={attachment.downloadUrl} width="100%" />
                              </div>
                            ))}
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                </tbody>
              </table>
            </div>
            <div>
              <label className="mr-2">Guest Questions: </label>
              <table className="table table-sm">
                <tbody>
                  {item.guestAnswers &&
                    item.guestAnswers.map((c, index) => (
                      <tr>
                        <td>Guest {index + 1}</td>
                        <td>
                          <table className="table table-sm table-striped">
                            <tbody>
                              {c.answers.map(a => (
                                <tr>
                                  <td>{getGuestQuestionText(a.guestQuestionId)}</td>
                                  <td>{a.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default QAISubmissionViewPage;

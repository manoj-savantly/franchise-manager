package net.savantly.sprout.franchise.domain.operations.qai.section.submission;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;
import net.savantly.sprout.franchise.domain.operations.qai.guestQuestion.answerGroup.QAIGuestQuestionAnswerGroupService;
import net.savantly.sprout.franchise.domain.operations.qai.question.answer.QAIQuestionAnswerService;

@RequiredArgsConstructor
public class QAISubmissionService {

	private final static Logger log = LoggerFactory.getLogger(QAISubmissionService.class);
	private final QAISectionSubmissionRepository repository;
	private final QAIQuestionAnswerService qaService;
	private final QAIGuestQuestionAnswerGroupService gqaService;
	
	public QAISectionSubmission createEntity(QAISectionSubmissionDto object) {
		return updateEntity(new QAISectionSubmission(), object);
	}

	public QAISectionSubmission updateEntity(QAISectionSubmission entity, QAISectionSubmissionDto object) {
		return entity
			.setLocationId(object.getLocationId())
			.setSectionId(object.getSectionId())
			.setAnswers(qaService.upsert(object.getAnswers()))
			.setDateScored(ZonedDateTime.now())
			.setGuestAnswers(gqaService.upsert(object.getGuestAnswers()))
			.setManagerOnDuty(object.getManagerOnDuty())
			.setStaffAttendance(object.getStaffAttendance())
			.setStatus(object.getStatus());
	}

	public QAISectionSubmissionDto convert(QAISectionSubmission entity) {
		return new QAISectionSubmissionDto().setAnswers(qaService.convert(entity.getAnswers()))
				.setLocationId(entity.getLocationId())
				.setSectionId(entity.getSectionId())
				.setDateScored(entity.getDateScored())
				.setGuestAnswers(gqaService.convert(entity.getGuestAnswers()))
				.setItemId(entity.getItemId())
				.setManagerOnDuty(entity.getManagerOnDuty())
				.setStaffAttendance(entity.getStaffAttendance())
				.setStatus(entity.getStatus());
	}

	public List<QAISectionSubmissionDto> findByLocation(String locationId) {
		log.debug("find submissions by locationId {}", locationId);
		return repository.findByLocationId(locationId).stream().map(q -> convert(q)).collect(Collectors.toList());
	}
}

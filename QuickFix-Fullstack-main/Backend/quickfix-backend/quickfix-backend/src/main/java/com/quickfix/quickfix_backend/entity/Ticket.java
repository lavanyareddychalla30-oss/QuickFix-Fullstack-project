
package com.quickfix.quickfix_backend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "ticket_number", unique = true, length = 50)
    private String ticketNumber;

    private String title;

    @Column(length = 3000)
    private String description;

    private String category;
    private String priority;
    private String status;

    @Column(name = "requester_id")
    private String requesterId;

    // Must match AppUser.id, which is Long
    @Column(name = "assignee_id")
    private Long assigneeId;

    @Column(name = "created_at")
    private Long createdAt;

    @Column(name = "updated_at")
    private Long updatedAt;

    @Column(name = "resolved_at")
    private Long resolvedAt;

    public Ticket() {
    }

    @PrePersist
    public void beforeInsert() {
        long now = System.currentTimeMillis();

        if (ticketNumber == null || ticketNumber.isBlank()) {
            ticketNumber = "QF-" +
                    UUID.randomUUID().toString().substring(0, 8);
        }

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = System.currentTimeMillis();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(String requesterId) {
        this.requesterId = requesterId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Long resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}

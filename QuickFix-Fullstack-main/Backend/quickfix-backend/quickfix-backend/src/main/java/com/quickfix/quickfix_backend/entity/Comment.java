
package com.quickfix.quickfix_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", length = 40, nullable = false)
    private String ticketId;

    @Column(name = "content", length = 2000)
    private String content;

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "created_at")
    private Long createdAt;

    public Comment() {
    }

    @PrePersist
    public void beforeInsert() {
        if (createdAt == null) {
            createdAt = System.currentTimeMillis();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }
}

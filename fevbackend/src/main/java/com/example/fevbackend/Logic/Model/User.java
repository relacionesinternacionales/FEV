package com.example.fevbackend.Logic.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name= "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    @Column(name= "username", nullable = false, unique = true)
    private String username;

    //Password
    @NotBlank
    @Column(name = "password", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private Boolean enable = true;

    //------------------------------------------------------------------------------------------------------------------
    // Relacion
    //------------------------------------------------------------------------------------------------------------------
    @JsonIgnoreProperties({"user"})
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Empresa empresa;

    //    @JsonIgnoreProperties({"users"})
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name="users_id"),
            inverseJoinColumns = @JoinColumn(name = "roles_id"),
            uniqueConstraints = {@UniqueConstraint( columnNames = {"users_id", "roles_id"})}
    )
    private List<Role> roles;

    //------------------------------------------------------------------------------------------------------------------
    // Otros
    //------------------------------------------------------------------------------------------------------------------
    @Transient
    private Boolean isAdmin;
}

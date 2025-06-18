package com.inventorytest.InventoryApp;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.time.Duration;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SeleniumTestCases {
    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) driver.quit();
    }

    @Test @Order(1)
    public void testValidLogin() {
        driver.get("http://localhost:3000/login");
        driver.findElement(By.id("email")).sendKeys("user@example.com");
        driver.findElement(By.id("password")).sendKeys("123456");
        driver.findElement(By.tagName("form")).submit();
        Assertions.assertTrue(driver.getCurrentUrl().contains("/"));
    }

    @Test @Order(2)
    public void testInvalidLogin() {
        driver.get("http://localhost:3000/login");
        driver.findElement(By.id("email")).sendKeys("wrong@example.com");
        driver.findElement(By.id("password")).sendKeys("wrongpass");
        driver.findElement(By.tagName("form")).submit();
        WebElement error = driver.findElement(By.cssSelector("p.MuiTypography-root[color='error']"));
        Assertions.assertTrue(error.getText().toLowerCase().contains("failed"));
    }

    @Test @Order(3)
    public void testEmptyLoginFields() {
        driver.get("http://localhost:3000/login");
        driver.findElement(By.tagName("form")).submit();
        WebElement error = driver.findElement(By.cssSelector("p.MuiTypography-root[color='error']"));
        Assertions.assertTrue(error.isDisplayed());
    }

    @Test @Order(4)
    public void testValidSignup() {
        driver.get("http://localhost:3000/signup");
        driver.findElement(By.id("name")).sendKeys("Test User");
        driver.findElement(By.id("email")).sendKeys("newuser@example.com");
        driver.findElement(By.id("password")).sendKeys("123456");
        driver.findElement(By.id("confirmPassword")).sendKeys("123456");
        driver.findElement(By.tagName("form")).submit();
        Assertions.assertTrue(driver.getCurrentUrl().contains("/login"));
    }

    @Test @Order(5)
    public void testSignupMismatchedPasswords() {
        driver.get("http://localhost:3000/signup");
        driver.findElement(By.id("name")).sendKeys("Test User");
        driver.findElement(By.id("email")).sendKeys("test@example.com");
        driver.findElement(By.id("password")).sendKeys("123456");
        driver.findElement(By.id("confirmPassword")).sendKeys("abcdef");
        driver.findElement(By.tagName("form")).submit();
        WebElement error = driver.findElement(By.cssSelector("p.MuiTypography-root[color='error']"));
        Assertions.assertTrue(error.getText().contains("Passwords do not match"));
    }

    @Test @Order(6)
    public void testSignupDuplicateEmail() {
        driver.get("http://localhost:3000/signup");
        driver.findElement(By.id("name")).sendKeys("Test User");
        driver.findElement(By.id("email")).sendKeys("user@example.com");
        driver.findElement(By.id("password")).sendKeys("123456");
        driver.findElement(By.id("confirmPassword")).sendKeys("123456");
        driver.findElement(By.tagName("form")).submit();
        WebElement error = driver.findElement(By.cssSelector("p.MuiTypography-root[color='error']"));
        Assertions.assertTrue(error.isDisplayed());
    }

    @Test @Order(7)
    public void testAddValidProduct() {
        loginBeforeProductTest();
        driver.get("http://localhost:3000/products/add");
        driver.findElement(By.name("name")).sendKeys("Laptop");
        driver.findElement(By.name("category")).sendKeys("Electronics");
        driver.findElement(By.name("description")).sendKeys("A new laptop");
        driver.findElement(By.name("price")).sendKeys("500");
        driver.findElement(By.name("quantity")).sendKeys("5");
        driver.findElement(By.name("location")).sendKeys("Aisle 1");
        driver.findElement(By.tagName("form")).submit();
        Assertions.assertTrue(driver.getCurrentUrl().contains("/products"));
    }

    @Test @Order(8)
    public void testAddProductEmptyName() {
        loginBeforeProductTest();
        driver.get("http://localhost:3000/products/add");
        driver.findElement(By.name("category")).sendKeys("Electronics");
        driver.findElement(By.name("description")).sendKeys("Description");
        driver.findElement(By.name("price")).sendKeys("200");
        driver.findElement(By.name("quantity")).sendKeys("2");
        driver.findElement(By.name("location")).sendKeys("Shelf 3");
        driver.findElement(By.tagName("form")).submit();
        // Check that the product is not added or validation failed (no redirect)
        Assertions.assertTrue(driver.getCurrentUrl().contains("/add"));
    }

    @Test @Order(9)
    public void testAddProductNegativePrice() {
        loginBeforeProductTest();
        driver.get("http://localhost:3000/products/add");
        driver.findElement(By.name("name")).sendKeys("Bad Product");
        driver.findElement(By.name("category")).sendKeys("Electronics");
        driver.findElement(By.name("description")).sendKeys("Invalid price");
        driver.findElement(By.name("price")).sendKeys("-100");
        driver.findElement(By.name("quantity")).sendKeys("1");
        driver.findElement(By.name("location")).sendKeys("Shelf 5");
        driver.findElement(By.tagName("form")).submit();
        Assertions.assertTrue(driver.getCurrentUrl().contains("/add"));
    }

    @Test @Order(10)
    public void testLoginToSignupNavigation() {
        driver.get("http://localhost:3000/login");
        driver.findElement(By.linkText("Don't have an account? Sign Up")).click();
        Assertions.assertTrue(driver.getCurrentUrl().contains("/signup"));
    }

    private void loginBeforeProductTest() {
        driver.get("http://localhost:3000/login");
        driver.findElement(By.id("email")).sendKeys("user@example.com");
        driver.findElement(By.id("password")).sendKeys("123456");
        driver.findElement(By.tagName("form")).submit();
    }
}

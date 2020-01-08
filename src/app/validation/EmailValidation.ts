import ExpressValidator = require("express-validator");

/**
 * @author Mateus Macedo
 * @since  11/2019
 */

export class EmailValidation {
  /*
   *  Função responsável pela validações dos campos do request da rota /sendMail
   */

  public static sendMailValidation() {
    return [
      ExpressValidator.check("configEmail", "O campo configEmail é obrigatório")
        .not()
        .isEmpty(),
      ExpressValidator.check("configEmail.email", "O campo email é obrigatorio")
        .not()
        .isEmpty()
        .isEmail()
        .withMessage("O email informado é inválido"),
      ExpressValidator.check(
        "configEmail.password",
        "O campo password é obrigatorio"
      )
        .not()
        .isEmpty(),
      ExpressValidator.check(
        "configMessage",
        "O campo configMessage é obrigatório"
      )
        .not()
        .isEmpty(),
      ExpressValidator.check("configMessage.from", "O campo from é obrigatório")
        .not()
        .isEmpty(),
      ExpressValidator.check("configMessage.to", "O campo to é obrigatório")
        .not()
        .isEmpty(),
      ExpressValidator.check(
        "configMessage.subject",
        "O campo subject é obrigatório"
      )
        .not()
        .isEmpty(),
      ExpressValidator.check("configMessage.text", "O campo text é obrigatório")
        .not()
        .isEmpty()
    ];
  }
}
